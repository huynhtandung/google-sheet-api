import { useEffect } from "react";
import './App.css';
import { initGoogleSheet, getAllDataGoogleSheet, getDataGoogleSheetBySheetName, updateDataGoogleSheetBySheetName } from "./util";

function App() {
  useEffect(() => {
    initGoogleSheet("https://docs.google.com/spreadsheets/d/1fH8gYZCRIj5_W91Sb3vpvpBqxNtrkqc3XgCbKfepBDw/edit#gid=0").then(doc => {
      getAllDataGoogleSheet(doc).then(res => {
        console.log("Response: ", res)
      }).catch(err => console.log(err))
    })
  }, [])

  return (
    <div className="App">
    </div>
  );
}

export default App;
