import { Link } from "react-router-dom";
import { Button, Container, Typography } from "@material-ui/core";
import Table from "./Table";
import { useMemo } from "react";
import { useApi } from "../api";
import { PROFICIENCIES } from "../model";

function makeColumnGroups(skills, positions) {
  return [
    {
      label: "Candidate",
      columns: [
        {
          label: "Name",
          align: "left",
          getValue: (row) => row.candidate.name,
        },
      ],
    },
    {
      label: "Skill proficiency",
      columns: skills.map((skill) => ({
        label: skill.name,
        align: "left",
        getValue: (row) =>
          PROFICIENCIES.find(
            (proficiency) => proficiency.id === row.candidate.skills[skill.id]
          ).label,
      })),
    },
    {
      label: "Position match",
      columns: positions.map((position) => ({
        label: position.name,
        align: "right",
        getValue: (row) => `${Math.round(100 * row.positions[position.id])}%`,
      })),
    },
  ];
}

function CandidatesTable({ skills, positions, candidates }) {
  const columnGroups = useMemo(() => makeColumnGroups(skills, positions), [
    skills,
    positions,
  ]);
  return <Table columnGroups={columnGroups} rows={candidates} />;
}

export default function CandidatesPage() {
  const { skills, positions, candidates } = useApi();
  return (
    <Container>
      <div style={{ display: "flex", marginTop: "32px", marginBottom: "16px" }}>
        <Typography style={{ fontSize: "24px" }}>Candidates</Typography>
        <Button
          component={Link}
          variant="outlined"
          color="primary"
          to="/add-candidate"
          style={{ marginLeft: "32px" }}
        >
          Add candidate
        </Button>
      </div>
      <CandidatesTable
        skills={skills}
        positions={positions}
        candidates={candidates}
      />
    </Container>
  );
}
