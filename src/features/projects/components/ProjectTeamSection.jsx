import { useParams } from "react-router-dom";
import useProjectTeam from "../hooks/useProjectTeam";
import ProjectTeamTable from "./ProjectTeamTable";

const ProjectTeamSection = () => {
  const { id: projectId } = useParams();

  const { team, isLoading, refresh } = useProjectTeam(projectId);

  return (
    <ProjectTeamTable
      team={team}
      isLoading={isLoading}
      onDataUpdate={refresh}
    />
  );
};

export default ProjectTeamSection;
