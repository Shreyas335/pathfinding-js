
import './App.css';
import Grid from './components/grid';
import Controls from './components/Controls';

function App() {
  return (
    <div id="app">
      <div style={{ display: 'flex' }}>
      <Controls/>
      <Grid rows={25} columns={25}/>
      </div>
    </div>
  );
}

export default App;