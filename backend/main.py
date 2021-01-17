from typing import Dict
from flask import Flask, request, jsonify
from flask_cors import CORS
import pysmile
import pysmile_license
from dataclasses import dataclass
from dataclasses_json import dataclass_json

@dataclass_json
@dataclass
class Skill:
    id: str
    name: str

@dataclass_json
@dataclass
class Position:
    id: str
    name: str

@dataclass_json
@dataclass
class Candidate:
    name: str
    skills: Dict[str, str]

@dataclass_json
@dataclass
class MatchedCandidate:
    candidate: Candidate
    positions: Dict[str, float]

app = Flask(__name__)
CORS(app)

def load_model():
    net = pysmile.Network()
    net.read_file('bayesian_model.xdsl')
    skills = []
    positions = []

    for node_handle in net.get_all_nodes():
        node_id = net.get_node_id(node_handle)
        kind = [prop.value for prop in net.get_node_user_properties(node_id) if prop.name == 'kind'][0]
        name = [prop.value for prop in net.get_node_user_properties(node_id) if prop.name == 'name'][0]

        if kind == 'skill':
            skills.append(Skill(id=node_id, name=name))
        elif kind == 'position':
            positions.append(Skill(id=node_id, name=name))

    app.logger.info("Loaded skills:", skills)
    app.logger.info("Loaded positions:", positions)

    return skills, positions

skills, positions = load_model()
candidates = []

def match_candidate(candidate: Candidate) -> MatchedCandidate:
    net = pysmile.Network()
    net.read_file("bayesian_model.xdsl")

    for skill in skills:
        net.set_evidence(skill.id, candidate.skills[skill.id])

    net.update_beliefs()

    matches = {}

    for position in positions:
        posteriors = net.get_node_value(position.id)
        for i, posterior in enumerate(posteriors):
            if net.get_outcome_id(position.id, i) == 'yes':
                matches[position.id] = posterior

    return MatchedCandidate(candidate=candidate, positions=matches)

@app.route('/api/skills', methods=['GET'])
def get_skills():
    return jsonify(skills)

@app.route('/api/positions', methods=['GET'])
def get_positions():
    return jsonify(positions)

@app.route('/api/candidates', methods=['GET'])
def get_candidates():
    return jsonify(candidates)

@app.route('/api/candidates', methods=['POST'])
def add_candidate():
    candidate = Candidate.from_json(request.data)
    candidate_with_positions = match_candidate(candidate)
    candidates.append(candidate_with_positions)
    return jsonify(candidate_with_positions)
