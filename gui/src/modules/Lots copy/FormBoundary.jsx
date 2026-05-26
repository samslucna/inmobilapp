import { Button, ButtonGroup } from "@mui/material";
import BoundaryStore from "../../store/BoundaryStore";
import boundaryValidate from "../../validator/boundaryValidate";
import useValidatorForm from "../../hooks/useValidatorForm";

export default function FormBoundary({ datas, setDatas }) {
  
  const { state, errors, handleChange, handleSubmit, handleBlur } =
    useValidatorForm(
      BoundaryStore.boundary,
      boundaryValidate,
      BoundaryStore.addListBoundary,
    );

  const { id, name, description, m2 } = state;

  const saveBoundary = async (e) => {
    handleSubmit(e);
    BoundaryStore.setBoundary(state);
    setDatas([...datas, BoundaryStore.boundary]);
    BoundaryStore.setBoundaries(datas);
    BoundaryStore.setBoundary({
      id: null,
      name: "",
      description: "",
      m2: 0.0,
      property_id: null,
    });
  };

  return (
    <>
      <div class="ui form">
        <div class="four fields">
          <div class="field">
            <label>Al:</label>
            <input
              type="text"
              name="name"
              value={name}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Sur, Norte, Este, Etc.."
            />
            {errors.name && (
              <span class="ui pointing red basic label">{errors.name}</span>
            )}
          </div>
          <div class="field">
            <label>M2:</label>
            <input
              type="text"
              name="m2"
              value={m2}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="0.00"
            />
            {errors.m2 && (
              <span class="ui pointing red basic label">{errors.m2}</span>
            )}
          </div>
          <div class="field">
            <label>Colinda con:</label>
            <input
              type="text"
              name="description"
              value={description}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Lote 3, calle 24 etc."
            />
            {errors.description && (
              <span class="ui pointing red basic label">
                {errors.description}
              </span>
            )}
          </div>
          <div class="field">
            <div class="ui buttons">
              <ButtonGroup
                sx={{ mt: 3 }}
                variant="contained"
                aria-label="Basic button group"
              >
                <Button color="success" onClick={(e) => saveBoundary(e)}>
                  +Agregar
                </Button>
              </ButtonGroup>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
