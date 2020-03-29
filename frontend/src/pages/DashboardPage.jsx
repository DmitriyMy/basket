import React, { forwardRef, useState } from "react";
import MaterialTable from "material-table";
import AddBox from "@material-ui/icons/AddBox";
import ArrowDownward from "@material-ui/icons/ArrowDownward";
import Check from "@material-ui/icons/Check";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import ChevronRight from "@material-ui/icons/ChevronRight";
import Clear from "@material-ui/icons/Clear";
import DeleteOutline from "@material-ui/icons/DeleteOutline";
import Edit from "@material-ui/icons/Edit";
import FilterList from "@material-ui/icons/FilterList";
import FirstPage from "@material-ui/icons/FirstPage";
import LastPage from "@material-ui/icons/LastPage";
import Remove from "@material-ui/icons/Remove";
import SaveAlt from "@material-ui/icons/SaveAlt";
import Search from "@material-ui/icons/Search";
import ViewColumn from "@material-ui/icons/ViewColumn";
import Button from "@material-ui/core/Button";
import requestToServer from "../pages/services/requestToServer";

const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};

function Dashboard() {
  const [state, setState] = useState({
    columns: [
      { title: 'Name', field: 'name', type: 'string' },
      { title: 'Quantity', field: 'quantity', type: 'numeric', initialEditValue: 'initial edit value' },
      {
        title: 'Currency',
        field: 'currency',
        lookup: { 'RUB': 'RUB', 'EUR': 'EUR', 'USD': 'USD' }
      },
      { title: 'Price', field: 'price', type: 'numeric' },
      { title: 'RUB', field: 'crossCost.RUB', type: 'object' },
      { title: 'EUR', field: 'crossCost.EUR', type: 'object' },
      { title: 'USD', field: 'crossCost.USD', type: 'object' }
    ],
    data: [
      { name: 'Рыба', quantity: 1, currency: 'RUB', price: 95 },
      { name: 'Масло', quantity: 2, currency: 'EUR', price: 1 },
      { name: 'Мясо', quantity: 3, currency: 'USD', price: 2 },
    ],
  });

  const arrayData = () => {
    return state.data.map(element => {
      return `{
        name: "${element.name}"
        quantity: ${element.quantity}
        currency: "${element.currency}"
        price: ${element.price}
      }`
    }); 
  }

  const handlerGetCalculate = () => {
    const getCalculate = () => {
      let arrayInput = arrayData();
      const queryBody = `mutation {
        getCalculate(input: [${arrayInput}]){
          name
          quantity
          currency
          price
          crossCost {
            RUB
            EUR
            USD
          }
        }
      }`;      
      const responceTable = requestToServer(queryBody)
        .then(responce => responce.getCalculate)
        .catch(error => {
          console.log("getCalculate data Error:", error);
          return [];
        });
      return responceTable;
    }
    getCalculate().then(result => setState((prevState) => {
      const data = result;
      return {...prevState, data};
    })).catch(error => console.log(`setData error`, error))
  }

  return (
    <div>
      <MaterialTable
        icons={tableIcons}
        title="Корзина"
        columns={state.columns}
        data={state.data}
        editable={{
          onRowAdd: (newData) =>
            new Promise((resolve) => {
              setTimeout(() => {
                resolve();
                setState((prevState) => {
                  const data = [...prevState.data];
                  data.push(newData);
                  return { ...prevState, data };
                });
              }, 600);
            }),
          onRowUpdate: (newData, oldData) =>
            new Promise((resolve) => {
              setTimeout(() => {
                resolve();
                if (oldData) {
                  setState((prevState) => {
                    const data = [...prevState.data];
                    data[data.indexOf(oldData)] = newData;
                    return { ...prevState, data };
                  });
                }
              }, 600);
            }),
          onRowDelete: (oldData) =>
            new Promise((resolve) => {
              setTimeout(() => {
                resolve();
                setState((prevState) => {
                  const data = [...prevState.data];
                  data.splice(data.indexOf(oldData), 1);
                  return { ...prevState, data };
                });
              }, 600);
            }),
        }}
      />
      <div style={{margin: "20px"}}>
        <Button
          type="button"
          variant="contained"
          color="primary"
          onClick={handlerGetCalculate}
        >
          Рассчитать
        </Button>
      </div>
    </div>
  )
}

export default Dashboard;