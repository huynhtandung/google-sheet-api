import { useEffect } from "react";
import './App.css';
import { initGoogleSheet, getAllDataGoogleSheet, getDataGoogleSheetBySheetName, updateDataGoogleSheetBySheetName } from "./util";

function App() {
  //get all
  // useEffect(() => {
  //   initGoogleSheet("https://docs.google.com/spreadsheets/d/1fH8gYZCRIj5_W91Sb3vpvpBqxNtrkqc3XgCbKfepBDw/edit#gid=0").then(doc => {
  //     getAllDataGoogleSheet(doc).then(res => {
  //       console.log(res)
  //     }).catch(err => console.log(err))
  //   }).catch(err => console.log(err))
  // }, [])

  //get by sheet name
  // useEffect(() => {
  //   initGoogleSheet("https://docs.google.com/spreadsheets/d/1fH8gYZCRIj5_W91Sb3vpvpBqxNtrkqc3XgCbKfepBDw/edit#gid=0").then(doc => {
  //     getDataGoogleSheetBySheetName(doc, ["aa", "cc", "dd","bb"]).then(res => {
  //       console.log(res)
  //     }).catch(err => console.log(err))
  //   })
  // }, [])

  useEffect(() => {
    initGoogleSheet("https://docs.google.com/spreadsheets/d/1fH8gYZCRIj5_W91Sb3vpvpBqxNtrkqc3XgCbKfepBDw/edit#gid=0").then(doc => {
      updateDataGoogleSheetBySheetName(doc, "dda", [
        {
          name: "a",
          add: "QN"
        },
        {
          name: "b",
          add: "QN1",
          dasdasd: 12
        }
      ] , false).then(res => {
        console.log(res)
      }).catch(err => console.log(err))
    })
  }, [])

  return (
    <div className="App">
    </div>
  );
}

export default App;
