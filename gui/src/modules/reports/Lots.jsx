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
import BoundaryStore from "../../store/BoundaryStore";
import BoundaryMain from "../boundaries";
import useSaveSub from "../../hooks/useSaveSub";
import ProjectStore from "../../store/ProjectStore";
import StageStore from "../../store/StageStore";
import { observer } from "mobx-react-lite";
import TableDatas from "./Components/TableDatas";
import Checkets from "./Components/Ckeckets";

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
    useSaveSub(
      PropertyStore.property,
      propertyValidate,
      PropertyStore.addProperty,
    );

  const {
    id,
    block_id,
    project_id,
    stage_id,
    name,
    description,
    address,
    m2,
    amount_end,
    amount_init,
  } = state;

  const saveProperty = async (e) => {
    const data = {
      ...state,
      boundaries: BoundaryStore.Boundaries,
    };
    setState(data);
    handleSubmit(e);
  };

  const onChangeSelector = async (e) => {
    const { name, value } = e.target;

    if (name === "project_id") {
      const projects = data.projects.filter((project) => project.id === value);
      let optsel = {
        project: projects[0].id,
        stage: projects[0].stage_id,
        block: "",
      };
      setSelected(optsel);
      setData({ ...data, stages: projects[0].stages });
    }
    if (name === "stage_id") {
      const blocks = await BlocksStore.getBlocksByStage(value);
      let selectBlock = blocks.filter((block) => block.stage_id === value);
      let optsel = {
        project: selected.project,
        stage: value,
        block: selectBlock[0].id,
      };
      setSelected(optsel);
      setData({ ...data, blocks: selectBlock });
    }

    if (name === "block_id") {
      let optsel = {
        project: selected.project,
        stage: selected.stage,
        block: value,
      };
      setSelected(optsel);
      setState({ ...state, block_id: optsel.block });
      console.log(optsel);
      console.log(state);
    }

    handleChange(e);
  };

  useEffect(() => {
    const init = async () => {
      const projecs = await ProjectStore.loadProjects();
      try {
        if (PropertyStore.editing) {
          if (PropertyStore.property.block_id !== null) {
            const blocks = await BlocksStore.getBlocks();

            const getBLock = blocks.filter(
              (block) => block.id === PropertyStore.property.block_id,
            );

            const projectId = getBLock[0].stage.project_id;
            const getProjectSelect = projecs.filter(
              (project) => project.id === projectId,
            )[0];

            const getBlocksProject = blocks.filter(
              (blocks) => blocks.stage_id === getBLock[0].stage_id,
            );

            const projectStage = {
              projects: projecs,
              stages: getProjectSelect.stages,
              blocks: getBlocksProject,
            };

            const selectOpt = {
              project: getProjectSelect.id,
              stage: getBLock[0].stage_id,
              block: PropertyStore.property.block_id,
            };

            //console.log(selectOpt)
            setData(projectStage);
            setSelected(selectOpt);
          }
        } else {
          const stages = projecs[0].stages;
          const block = await BlocksStore.getBlocksByStage(stages[0].id);
          const projectStage = {
            projects: projecs,
            stages: stages,
            blocks: block,
          };

          const selectOpt = {
            project: projectStage.projects[0].id,
            stage: stages[0]?.id,
            block: parseInt(block[0]?.id),
          };

          console.log(selectOpt);
          setState({ ...state, project_id: selectOpt.projecs });
          setState({ ...state, stage_id: selectOpt.stage });
          setState({ ...state, block_id: selectOpt.block });
          setData(projectStage);
          setSelected(selectOpt);
        }
      } catch (error) {
        console.log(error);
      }
    };
    init();
  }, []);

  return (
    <>
      <Box  >
        <Card size={{ xs: "100%", md: "70%" }} sx={{p:4, m: "0 auto" }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            {PropertyStore.editing === false
              ? "Registrar nuevo lote"
              : "Editar lote"}
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
              <Grid size={{ xs: 12, md: 2 }}>
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
              <Checkets />
              </Grid>
              
              <DialogActions sx={{ p: 3 ,mt: -1}}>
                <Button
                  onClick={() => {
                    PropertyStore.setHiddenForm(false);
                    PropertyStore.setEditing(false);
                  }}
                  sx={{ background: "#2d5bda", color: "white" }}
                >
                  Filtrar
                </Button>
               
              </DialogActions>
            </Grid>
          </Grid>
        </Card>
        <TableDatas list={[]} />
      </Box>
    </>
  );
});

export default Lots;
