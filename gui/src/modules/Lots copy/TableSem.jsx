import { Button, ButtonGroup } from "@mui/material";
import Swal from "sweetalert2";
import "semantic-ui-css/semantic.min.css";
import BoundaryStore from "../../store/BoundaryStore";
import FormBoundary from "./FormBoundary";
import { useState } from "react";

export default function TableSem() {
  const { Boundaries } = BoundaryStore;
  const [datas, setDatas] = useState([]);

  const removeBtn = (id) => {
    try {
      Swal.fire({
        title: "¿Estas seguro?",
        text: "No podras recuperar esta colindancia",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, eliminarlo!",
      }).then((resp) => {
        if (resp.isConfirmed) {
          const newList = Boundaries.filter(
            (boundary, index) => index !== parseInt(id - 1),
          );
          setDatas(newList);
          BoundaryStore.setBoundaries(newList);

          Swal.fire({
            title: "Eliminado",
            text: "Se elimino correctamente",
            timer: 1500,
            showConfirmButton: false,
          });
        }
      });
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Error al eliminar el colindancia",
        icon: "warning",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

  const editBtn = (e,id) => {
    e.preventDefault();
    const boundary = Boundaries.find(
      (boundary, index) => index === parseInt(id - 1),
    );

    BoundaryStore.setBoundary(boundary);
  };

  return (
    <>
      <FormBoundary datas={datas} setDatas={setDatas} />
      <table key={"boundary"} className="ui stackable small table">
        <thead>
          <tr>
            <th>Numero</th>
            <th>Al</th>
            <th>M2</th>
            <th>Colinda con</th>
            <th>Accion</th>
          </tr>
        </thead>
        <tbody>
          {Boundaries !== [] && Boundaries !== undefined
            ? Boundaries.map((data, i) => {
                data.index = i + 1;
                return (
                  <tr key={"r" + data.index}>
                    <td>{data.index}</td>
                    <td>{data.name}</td>
                    <td>{data.m2}</td>
                    <td>{data.description}</td>
                    
                    <td>
                      <ButtonGroup
                        sx={{ mt: 3 }}
                        variant="contained"
                        aria-label="Basic button group"
                      >
                        <Button
                          color="error"
                          onClick={() => removeBtn(data.index)}
                        >
                          X
                        </Button>
                        <Button
                          color="warning"
                          onClick={(e) => editBtn(e,data.index)}
                        >
                          E
                        </Button>
                      </ButtonGroup>
                    </td>
                  </tr>
                );
              })
            : null}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={6}>
              <div className="ui divider"></div>
              <div className="ui icon buttons"></div>
            </td>
          </tr>
        </tfoot>
      </table>
    </>
  );
}
