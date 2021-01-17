import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const BASE_URL = "http://localhost:5000/api";

async function fetchSkills() {
  const response = await fetch(`${BASE_URL}/skills`);
  return await response.json();
}

async function fetchPositions() {
  const response = await fetch(`${BASE_URL}/positions`);
  return await response.json();
}

async function fetchCandidates() {
  const response = await fetch(`${BASE_URL}/candidates`);
  return await response.json();
}

async function createCandidate(candidate) {
  const response = await fetch(`${BASE_URL}/candidates`, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(candidate),
  });
  return await response.json();
}

const ApiContext = createContext(null);

export function ApiProvider({ children }) {
  const [skills, setSkills] = useState([]);
  const [positions, setPositions] = useState([]);
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    fetchSkills().then(setSkills);
    fetchPositions().then(setPositions);
    fetchCandidates().then(setCandidates);
  }, []);

  const addCandidate = useCallback(
    async (newCandidate) => {
      await createCandidate(newCandidate)
        .then(fetchCandidates)
        .then(setCandidates);
    },
    [setCandidates]
  );

  return (
    <ApiContext.Provider
      value={{
        skills,
        positions,
        candidates,
        addCandidate,
      }}
    >
      {children}
    </ApiContext.Provider>
  );
}

export function useApi() {
  return useContext(ApiContext);
}
