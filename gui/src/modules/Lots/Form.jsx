import {
  Button,
  Card,
  Box,
  TextField,
  DialogActions,
  Alert,
  Typography,
  Grid,
  useTheme,
  useMediaQuery,
  InputAdornment,
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
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
    latitude,
    longitude,
  } = state;

  const saveProperty = async (e) => {
    e.preventDefault();
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
        if (PropertyStore.editing && PropertyStore.property.block_id) {
          // --- MODO EDICIÓN ---

          setData({
            projects: [],
            stages: [],
            blocks: [],
          });
          const block = await BlocksStore.filterBlocks({
            id: PropertyStore.property.block_id,
          });
          const stage = await StageStore.filterStages({
            id: block.data[0].stage_id,
          });

          const project = await ProjectStore.filterProjects({
            id: stage.data[0].project_id,
          });

          let selectedData = {
            project: PropertyStore?.property?.project_id || 0,
            stage: PropertyStore?.property?.stage_id || 0,
            block: PropertyStore?.property?.block_id || 0,
          };
          setSelected(selectedData);

          setData({
            projects: project.data,
            stages: stage.data,
            blocks: block.data,
          });

          setState({
            ...state,
            block_id: block.data[0]?.id || 0,
          });

          //
        } else {
          const [rawProjects, rawBlocks, rawStages] = await Promise.all([
            ProjectStore.loadProjects(),
            BlocksStore.getBlocks(),
            StageStore.getStages(),
          ]);
          let projecs = [
            { id: 0, name: "Todos los proyectos" },
            ...rawProjects,
          ];
          let blocks = [{ id: 0, name: "Todas las manzanas" }, ...rawBlocks];
          let stages = [{ id: 0, name: "Todas las etapas" }, ...rawStages];

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
      <Box display="flex" justifyContent="center" sx={{ width: "100%" }}>
        <Card
          sx={{
            p: { xs: 2, sm: 3, md: 4 },
            width: "100%",
            maxWidth: "1200px",
            mx: { xs: 1, sm: 2, md: 0 },
          }}
        >
          <Typography
            variant={isMobile ? "h6" : "h5"}
            sx={{ mb: 2, fontWeight: "bold" }}
          >
            {PropertyStore.editing === false
              ? "Registrar nuevo lote"
              : "Editar lote"}
          </Typography>

          <Grid container spacing={isMobile ? 1.5 : 2}>
            {/* Columna Izquierda - Información del Lote */}
            <Grid
              container
              size={{ xs: 12, md: 6 }}
              spacing={isMobile ? 1.5 : 2}
            >
              {/* Proyecto */}
              <Grid size={{ xs: 12, md: 5 }}>
                <Selector
                  datas={data.projects}
                  label={"Proyecto"}
                  name={"project_id"}
                  value={selected.project}
                  onChange={onChangeSelector}
                  blur={handleBlur}
                />
              </Grid>

              {/* Etapa */}
              <Grid size={{ xs: 12, md: 7 }}>
                <Selector
                  key={"stages"}
                  datas={data.stages}
                  label={"Etapa"}
                  name={"stage_id"}
                  value={selected.stage || 0}
                  onChange={onChangeSelector}
                  blur={handleBlur}
                />
              </Grid>

              {/* Manzana */}
              <Grid size={{ xs: 12, md: 12 }}>
                <Selector
                  datas={data.blocks}
                  label={"Manzana"}
                  name={"block_id"}
                  value={
                    data.blocks.some((b) => b.id === block_id) ? block_id : ""
                  }
                  onChange={onChangeSelector}
                  blur={handleBlur}
                />
              </Grid>

              {/* Nombre/Clave */}
              <Grid size={{ xs: 12, md: 3 }}>
                <TextField
                  name="name"
                  label="Nombre/Clave"
                  type="text"
                  fullWidth
                  required
                  value={name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  size="small"
                  sx={{ mb: errors.name ? 0 : 2 }}
                />
                {errors.name && (
                  <Alert severity="error" sx={{ mt: 0.5, mb: 2 }}>
                    {errors.name}
                  </Alert>
                )}
              </Grid>

              {/* Descripción */}
              <Grid size={{ xs: 12, md: 9 }}>
                <TextField
                  name="description"
                  label="Descripción"
                  fullWidth
                  required
                  value={description}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  size="small"
                  sx={{ mb: errors.description ? 0 : 2 }}
                />
                {errors.description && (
                  <Alert severity="error" sx={{ mt: 0.5, mb: 2 }}>
                    {errors.description}
                  </Alert>
                )}
              </Grid>

              {/* M2 */}
              <Grid size={{ xs: 12, md: 3 }}>
                <TextField
                  name="m2"
                  label="M2"
                  fullWidth
                  required
                  value={m2}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  size="small"
                  type="number"
                  sx={{ mb: errors.m2 ? 0 : 2 }}
                />
                {errors.m2 && (
                  <Alert severity="error" sx={{ mt: 0.5, mb: 2 }}>
                    {errors.m2}
                  </Alert>
                )}
              </Grid>

              {/* Dirección */}
              <Grid size={{ xs: 12, md: 9 }}>
                <TextField
                  name="address"
                  label="Dirección"
                  type="text"
                  fullWidth
                  required
                  value={address}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  size="small"
                  sx={{ mb: errors.address ? 0 : 2 }}
                />
                {errors.address && (
                  <Alert severity="error" sx={{ mt: 0.5, mb: 2 }}>
                    {errors.address}
                  </Alert>
                )}
              </Grid>

              {/* Precio Inicial */}
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  name="amount_init"
                  label="Precio inicial ($)"
                  type="text"
                  fullWidth
                  required
                  value={amount_init}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  size="small"
                  sx={{ mb: errors.amount_init ? 0 : 2 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    ),
                  }}
                />
                {errors.amount_init && (
                  <Alert severity="error" sx={{ mt: 0.5, mb: 2 }}>
                    {errors.amount_init}
                  </Alert>
                )}
              </Grid>

              {/* Precio Final */}
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  name="amount_end"
                  label="Precio final ($)"
                  type="text"
                  fullWidth
                  required
                  value={amount_end}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  size="small"
                  sx={{ mb: 2 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">$</InputAdornment>
                    ),
                  }}
                />
              </Grid>

              {/* Latitud */}
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  name="latitude"
                  label="Latitud"
                  type="text"
                  fullWidth
                  required
                  value={latitude}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  size="small"
                  sx={{ mb: 2 }}
                  placeholder="Ej: 19.4326077"
                />
              </Grid>

              {/* Longitud */}
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  name="longitude"
                  label="Longitud"
                  type="text"
                  fullWidth
                  required
                  value={longitude}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  size="small"
                  sx={{ mb: 2 }}
                  placeholder="Ej: -99.133208"
                />
              </Grid>
            </Grid>

            {/* Columna Derecha - Mapa de Límites */}
            <Grid
              container
              size={{ xs: 12, md: 6 }}
              spacing={isMobile ? 1.5 : 2}
            >
              <Grid size={{ xs: 12, md: 12 }}>
                <Box
                  sx={{
                    height: { xs: "300px", sm: "400px", md: "450px" },
                    width: "100%",
                    minHeight: "250px",
                    borderRadius: 1,
                    overflow: "hidden",
                    border: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <BoundaryMain />
                </Box>
              </Grid>
            </Grid>
          </Grid>

          {/* Botones de Acción */}
          <DialogActions
            sx={{
              p: { xs: 2, sm: 3 },
              flexDirection: { xs: "column", sm: "row" },
              gap: { xs: 1, sm: 0 },
              mt: 2,
            }}
          >
            <Button
              fullWidth={isMobile}
              onClick={() => {
                PropertyStore.setHiddenForm(false);
                PropertyStore.setEditing(false);
              }}
              variant="contained"
              sx={{
                background: "gray",
                color: "whitesmoke",
                "&:hover": { background: "#666" },
                order: { xs: 2, sm: 1 },
              }}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth={isMobile}
              onClick={(e) => saveProperty(e)}
              sx={{
                order: { xs: 1, sm: 2 },
                "&:hover": {
                  backgroundColor: "primary.dark",
                },
              }}
            >
              Guardar
            </Button>
          </DialogActions>
        </Card>
      </Box>
    </>
  );
}
