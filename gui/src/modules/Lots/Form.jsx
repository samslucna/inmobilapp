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

export default function Form() {
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

          console.log(selectOpt)
          setState({...state, project_id:selectOpt.projecs});
          setState({...state, stage_id:selectOpt.stage});
          setState({...state, block_id:selectOpt.block})
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
      <Box display="flex">
        <Card sx={{ p: 4 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            {PropertyStore.editing === false
              ? "Registrar nuevo lote"
              : "Editar lote"}
          </Typography>

          <Grid container spacing={2}>
            <Grid container size={{ sm: 12, md: 6 }}>
              <Grid size={{ sm: 12, md: 5 }}>
                <Selector
                  datas={data.projects}
                  label={"Proyecto"}
                  name={"project_id"}
                  value={selected.project}
                  onChange={onChangeSelector}
                  blur={handleBlur}
                />
              </Grid>
              <Grid size={{ sm: 12, md: 6 }}>
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
              <Grid size={{ sm: 12, md: 12 }}>
                <Selector
                  datas={data.blocks}
                  label={"Manzana"}
                  name={"block_id"}
                  value={selected.block}
                  onChange={onChangeSelector}
                  blur={handleBlur}
                />
              </Grid>

              <Grid size={{ sm: 12, md: 3 }}>
                <TextField
                  name="name"
                  label="Nombre/Clave"
                  type="text"
                  fullWidth
                  required
                  value={name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  sx={{ mb: 2 }}
                />
                {errors.name && <Alert severity="error">{errors.name}</Alert>}
              </Grid>
              <Grid size={{ sm: 12, md: 9 }}>
                <TextField
                  name="description"
                  label="Descripcion"
                  fullWidth
                  required
                  value={description}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />

                {errors.description && (
                  <Alert severity="error">{errors.description}</Alert>
                )}
              </Grid>

              <Grid size={{ sm: 12, md: 3 }}>
                <TextField
                  name="m2"
                  label="M2"
                  fullWidth
                  required
                  value={m2}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />

                {errors.m2 && <Alert severity="error">{errors.m2}</Alert>}
              </Grid>
              <Grid size={{ sm: 12, md: 9 }}>
                <TextField
                  name="address"
                  label="Direccion"
                  type="text"
                  fullWidth
                  required
                  value={address}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  sx={{ mb: 2 }}
                />

                {errors.address && (
                  <Alert severity="error">{errors.address}</Alert>
                )}
              </Grid>
              <Grid size={{ sm: 12, md: 6 }}>
                <TextField
                  name="amount_init"
                  label="Precio inicial ($)"
                  type="text"
                  fullWidth
                  required
                  value={amount_init}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  sx={{ mb: 2 }}
                />

                {errors.amount_init && (
                  <Alert severity="error">{errors.amount_init}</Alert>
                )}
              </Grid>
              <Grid size={{ sm: 12, md: 6 }}>
                <TextField
                  name="amount_end"
                  label="Precio final ($)"
                  type="text"
                  fullWidth
                  required
                  value={amount_end}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  sx={{ mb: 2 }}
                />
              </Grid>
            </Grid>

            <Grid container size={{ sm: 12, md: 6 }}>
              <Grid size={{ sm: 12, md: 12 }}>
                <BoundaryMain />
              </Grid>
            </Grid>
          </Grid>

          <DialogActions sx={{ p: 3 }}>
            <Button
              onClick={() => {
                PropertyStore.setHiddenForm(false);
                PropertyStore.setEditing(false);
              }}
              sx={{ background: "gray", color: "whitesmoke" }}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              onClick={(e) => saveProperty(e)}
            >
              Guardar
            </Button>
          </DialogActions>
        </Card>
      </Box>
    </>
  );
}
