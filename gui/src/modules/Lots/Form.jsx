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
    const dataform = {
      ...state,
      boundaries: BoundaryStore.Boundaries,
    };

    setState(dataform);
    handleSubmit(e);
  };

  const onChangeSelector = async (e) => {
    e.preventDefault();
    const { name, value } = e.target;

    if (name === "project_id") {
      const project = data.projects.filter(
        (project) => project.id === value,
      )[0];

      let sel = {
        project: project.id ? project.id : 0,
        stage: project.stage_id ? project.stage_id : 0,
        block: project.block_id ? project.block_id : 0,
      };

      //project.stages.unshift({ id: 0, name: "Todas las etapas" });
      setData({ ...data, stages: project.stages });
      setSelected(sel);
      setState({
        ...state,
        project_id: sel.project,
        stage_id: sel.stage,
        block_id: sel.block,
      });
    }
    if (name === "stage_id") {
      let stages = await StageStore.getStages();
      let stage = stages.filter((stage) => stage.id === value)[0];

      if (stage) {
        let gtblocks = stage.blocks[0];

        let sel = {
          project: stage.project_id,
          stage: stage.id,
          block: gtblocks.id,
        };

        setData({ ...data, blocks: stage.blocks });
        setSelected(sel);
        setState({
          ...state,
          project_id: sel.project,
          stage_id: stage.id,
          block_id: gtblocks.id,
        });

        //setState(datas);
      } else {
        console.log(selected);
        let auxStage = [
          {
            id: 0,
            name: "Seleccione una etapa",
            blocks: [
              {
                id: 0,
                name: "--No ha seleccionado una etapa---",
                stage_id: 0,
              },
            ],
            project_id: selected.project,
          },
        ];

        setData({ ...data, blocks: auxStage[0].blocks });

        setSelected({ ...selected, block: 0, stage: 0 });
        setState({ ...state, block_id: 0, stage_id: 0 });
      }
    }

    if (name === "block_id") {
      let sel = {
        project: selected.project,
        stage: selected.stage,
        block: value,
      };

      setSelected(sel);
      setState({ ...state, block_id: sel.block });
    }

    handleChange(e);
  };

  useEffect(() => {
    const init = async () => {
      try {
        let projecs = await ProjectStore.loadProjects();
        let blocks = await BlocksStore.getBlocks();
        let stages = await StageStore.getStages();

        if (PropertyStore.editing) {
          if (PropertyStore.property.block_id !== null) {
            let getBLock = blocks.filter(
              (block) => block.id === block_id,
            );

            let getStage = stages.filter(
              (stage) => stage.id === getBLock[0].stage_id,
            );

            
            let getProject = projecs.filter(
              (project) => project.id === getStage[0].project_id,
            );


            let filtergetStage = stages.filter(
              (stage) => stage.project_id === getProject[0].id,
            );

            let filterBlocks = blocks.filter(
              (block) => block.stage_id === getStage[0].id,
            );
             
            setSelected({
              ...selected,
              project: getStage[0]?.project_id,
              block: getBLock[0]?.id,
              stage: getStage[0]?.id,
            });
            let changeState = {
              ...state,
              stage_id: getStage[0]?.id,
            }
            console.log(changeState)
            setState(changeState);
            
          
              setData({
              ...data,
              projects: projecs,
              blocks: filterBlocks,
              stages: filtergetStage,
            });
            
          }
        } else {
          projecs.unshift({ id: 0, name: "Todos los proyectos" });
          blocks.unshift({ id: 0, name: "Todas las manzanas" });
          stages.unshift({ id: 0, name: "Todas las etapas" });
          setData({
            ...data,
            blocks: blocks,
            stages: stages,
            projects: projecs,
          });

          const selectOpt = {
            project: projecs[0]?.id,
            stage: stages[0]?.id,
            block: blocks[0]?.id,
          };

          setState({ ...state, project_id: selectOpt.project });
          setState({ ...state, stage_id: selectOpt.stage });
          setState({ ...state, block_id: selectOpt.block });

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
                  value={block_id}
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
