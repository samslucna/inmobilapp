import {
  Button,
  Card,
  Box,
  TextField,
  DialogActions,
  Alert,
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
import TableDatas from "./Components/TableDatas";
import Checkets from "./Components/Ckeckets";
import SearchByDate from "./SearchByDate";

const Lots = observer(() => {
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
  
  const { state, errors, setState, handleChange, handleSubmit, handleBlur } =
    useSaveSub(ReportStore.report, propertyValidate, ReportStore.addReport);

  const { id, block_id, project_id, stage_id, dates, status } = state;

  const saveProperty = async (e) => {
    setState(data);
    handleSubmit(e);
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
      setState({ ...state, block_id: optsel.block });
    }

    handleChange(e);
  };

  const filterReports = async (e) => {
    e.preventDefault();
    
    try {
      let filters = {
        project_id: selected.project,
        stage_id: selected.stage,
        block_id: selected.block,
        dates: ReportStore.rangeDate,
        status: ReportStore.checkboxes,
      };

      await ReportStore.filterByLots(filters);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
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
        setState({ ...state, project_id: selectOpt.projecs });
        setState({ ...state, stage_id: selectOpt.stage });
        setState({ ...state, block_id: selectOpt.block });
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
            Reportes de lotes
          </Typography>

          <Grid spacing={2}>
            <Grid container size={{ xs: 12, md: 12 }}>
              <Grid size={{ xs: 12, md: 2 }}>
                <Selector
                  datas={data.projects}
                  label={"Proyecto"}
                  name={"project_id"}
                  value={selected.project}
                  onChange={onChangeSelector}
                  blur={handleBlur}
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
                  blur={handleBlur}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 1 }}>
                <Selector
                  datas={data.blocks}
                  label={"Manzana"}
                  name={"block_id"}
                  value={selected.block}
                  onChange={onChangeSelector}
                  blur={handleBlur}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 3 }} sx={{ mt: 2 }}>
                <Checkets data={ReportStore.checkboxes} />
              </Grid>
              <Grid size={{ xs: 12, md: 2 }} sx={{ mt: 2 }}>
                <SearchByDate action={filterReports} />
              </Grid>
            </Grid>
          </Grid>
        </Card>
        <TableDatas list={ReportStore.reports} />
      </Box>
    </>
  );
});

export default Lots;
