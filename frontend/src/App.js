import { BrowserRouter, Switch, Route } from "react-router-dom";
import AddCandidatePage from "./addCandidate/AddCandidatePage";
import { ApiProvider } from "./api";
import CandidatesPage from "./candidates/CandidatesPage";

export default function App() {
  return (
    <BrowserRouter>
      <ApiProvider>
        <Switch>
          <Route path="/add-candidate">
            <AddCandidatePage />
          </Route>
          <Route path="/">
            <CandidatesPage />
          </Route>
        </Switch>
      </ApiProvider>
    </BrowserRouter>
  );
}
