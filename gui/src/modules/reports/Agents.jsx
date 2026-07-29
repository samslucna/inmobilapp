import {
  Button,
  Card,
  Box,
  TextField,
  DialogActions,
  Alert,
  Autocomplete,
  Typography,
  Grid,
} from "@mui/material";

import PropertyStore from "../../store/PropertyStore";
import propertyValidate from "../../validator/propertyValidate";
import Selector from "./Selector";
import BlocksStore from "../../store/BlocksStore";
import { useEffect, useState } from "react";
import ReportStore from "../../store/ReportStore";
import BoundaryMain from "../boundaries";
import useSaveSub from "../../hooks/useSaveSub";
import ProjectStore from "../../store/ProjectStore";
import StageStore from "../../store/StageStore";
import { observer } from "mobx-react-lite";
import TableDatasAgent from "./Components/TableDatasAgent";
import Checkets from "./Components/Ckeckets";
import SearchByDate from "./SearchByDate";
import AgentStore from "../../store/AgentStore";
import ContractStore from "../../store/ContractStore";

const Agents = observer(() => {
  const { agent, setAgent, agents, setAgents, seachQueryData } = AgentStore;
  const [data, setData] = useState({
    projects: [],
    stages: [],
    blocks: [],
  });

  const [selected, setSelected] = useState({
    project: "",
    stage: "",
    block: "",
  });

  const [searchEdit, setSearchEdit] = useState(null);
  const [loading, setLoading] = useState(false);
  const [contracts, setContracts] = useState([]);

  const filterReports = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      let filters = {
        date_from: "",
        date_to: "",
        agent_id: agent ? agent?.id : "",
        project_id: selected.project ? selected.project : 0,
        stage_id: selected.stage ? selected.stage : 0,
        block_id: selected.block ? selected.block : 0 ,
      };

      ReportStore.setFilters(filters);
      const res = await ReportStore.filterByAgents(filters);

      ReportStore.setPagination(res);
      ReportStore.setReports(res.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const searchBy = async (e, result) => {
    e.preventDefault();
    const { name, value } = e.target || result;

    setSearchEdit(name);

    let error = "";

    if (value !== "" && value !== undefined) {
      switch (name) {
        case "srchagent":
          setAgents([]);
          const agentes = await seachQueryData("agents", value);
          if (!value) error = "Seleccione un agente";
          setAgents(agentes);
          break;
      }
    }
  };

  const onChangeSelector = async (e) => {
    const { name, value } = e.target;

    if (name === "project_id") {
      let projects = data.projects;

      projects = projects.filter((project) => project.id === value);

      let stages = projects[0].stages;
      let blocks = await BlocksStore.getBlocksByStage(stages[0].id);

      if (stages[0].name !== "Todas las etapas") {
        stages.unshift({
          id: 0,
          name: "Todas las etapas",
          project_id: projects[0].id,
        });
      }

      blocks.unshift({
        id: 0,
        name: "Todas las manzanas",
        stage_id: 0,
      });

      let optsel = {
        project: projects[0].id,
        stage: stages[0].id,
        block: projects[0].stages[0].id,
      };

      setSelected(optsel);
      setData({ ...data, stages: projects[0].stages });
    }
    if (name === "stage_id") {
      let blocks = await BlocksStore.getBlocksByStage(value);

      blocks.unshift({
        id: 0,
        name: "Todas las manzanas",
        stage_id: 0,
      });
      try {
        let optsel = {
          project: selected.project,
          stage: value,
          block: blocks[0].id,
        };
        setSelected(optsel);
        setData({ ...data, blocks: blocks });
      } catch (error) {
        console.log(error);
      }
    }

    if (name === "block_id") {
      let optsel = {
        project: selected.project,
        stage: selected.stage,
        block: value,
      };
      setSelected(optsel);
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        let agents = await AgentStore.loadAgents();

        agents.data.unshift({
          id: 0,
          name: "Todos",
          lastnames: "los agentes",
        });

        setAgent(agents.data[0]);
        let projecs = await ProjectStore.loadProjects();
        let blocks = await BlocksStore.getBlocks();

        projecs.unshift({
          id: 0,
          name: "Todos los proyectos",
          stages: [
            {
              id: 0,
              name: "Todas las etapas",
              project_id: 0,
            },
          ],
        });

        let stages = projecs[0].stages;

        blocks.unshift({
          id: 0,
          name: "Todas las manzanas",
          stage_id: 0,
        });

        const projectStage = {
          projects: projecs,
          stages: stages,
          blocks: blocks,
        };

        const selectOpt = {
          project: projectStage.projects[0].id,
          stage: stages[0]?.id,
          block: parseInt(blocks[0]?.id),
        };

        setData(projectStage);
        setSelected(selectOpt);
      } catch (error) {
        console.log(error);
      }
    };

    init();
  }, []);

  return (
    <>
      <Box>
        <Card size={{ xs: "100%", md: "70%" }} sx={{ p: 4, m: "0 auto" }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Reportes de Agentes
          </Typography>

          <Grid spacing={2}>
            <Grid container size={{ xs: 12, md: 12 }}>
              <Grid size={{ xs: 12, md: 2 }}>
                <Autocomplete
                  sx={{ marginBottom: 2 }}
                  key={"agente"}
                  options={agents}
                  value={agent}
                  getOptionLabel={(option) => {
                    try {
                      return (
                        option?.id +
                        ".- " +
                        option?.name +
                        " " +
                        option?.lastnames
                      );
                    } catch (error) {
                      console.log(error);
                    }
                  }}
                  onChange={(e, newValue) => {
                    if (e.currentTarget !== undefined) {
                      // Muestra el valor seleccionado

                      setAgent(newValue);
                    }
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      onChange={searchBy}
                      name={"srchclient"}
                      label="Agente"
                      fullWidth
                    />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 2 }}>
                <Selector
                  datas={data.projects}
                  label={"Proyecto"}
                  name={"project_id"}
                  value={selected.project}
                  onChange={onChangeSelector}
                />
              </Grid>
              <Grid container size={{ xs: 12, md: 2 }}>
                <Selector
                  key={"stages"}
                  datas={data.stages}
                  label={"Etapa"}
                  name={"stage_id"}
                  value={selected.stage}
                  onChange={onChangeSelector}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 1 }}>
                <Selector
                  datas={data.blocks}
                  label={"Manzana"}
                  name={"block_id"}
                  value={selected.block}
                  onChange={onChangeSelector}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 2 }} sx={{ mt: 2 }}>
                <SearchByDate action={filterReports} />
              </Grid>s
            </Grid>
          </Grid>
        </Card>
        <TableDatasAgent list={ReportStore.reports} loading={loading} />
      </Box>
    </>
  );
});

export default Agents;
