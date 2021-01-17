import {
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Paper,
  Typography,
  TextField,
  Container,
  Button,
} from "@material-ui/core";
import { Formik, Field, Form, useField } from "formik";
import { useHistory } from "react-router-dom";
import { useApi } from "../api";
import { PROFICIENCIES } from "../model";

function ProficiencyRadio({ fieldName, label }) {
  const [, { value }, { setValue }] = useField(fieldName);
  return (
    <FormControl component="fieldset">
      <FormLabel component="legend">{label}</FormLabel>
      <RadioGroup
        row
        name={fieldName}
        value={value}
        onChange={(event) => setValue(event.target.value)}
      >
        {PROFICIENCIES.map((proficiency) => (
          <FormControlLabel
            key={proficiency.id}
            value={proficiency.id}
            control={<Radio />}
            label={proficiency.label}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
}

function AddCandidateForm({ skills, onSubmit }) {
  const initialValues = {
    name: "",
    skills: Object.fromEntries(skills.map((skill) => [skill.id, "none"])),
  };

  return (
    <Formik initialValues={initialValues} onSubmit={onSubmit}>
      <Form>
        <Field
          as={TextField}
          name="name"
          variant="filled"
          label="Name"
          fullWidth
        />
        <Typography style={{ fontSize: "18px", marginTop: "24px" }}>
          Skills proficiency
        </Typography>
        <div
          style={{
            marginTop: "16px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          {skills.map((skill) => (
            <ProficiencyRadio
              key={skill.id}
              fieldName={`skills.${skill.id}`}
              label={skill.name}
            />
          ))}
        </div>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disableElevation
          style={{ marginTop: "24px" }}
        >
          Save
        </Button>
      </Form>
    </Formik>
  );
}

export default function AddCandidatePage() {
  const { skills, addCandidate } = useApi();
  const history = useHistory();

  async function handleSubmit(candidate) {
    await addCandidate(candidate);
    history.push("/");
  }

  if (skills.length === 0) {
    return null;
  }

  return (
    <Container maxWidth="sm">
      <Paper
        style={{
          margin: "24px",
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <Typography style={{ fontSize: "24px" }}>Add candidate</Typography>
        <AddCandidateForm skills={skills} onSubmit={handleSubmit} />
      </Paper>
    </Container>
  );
}
