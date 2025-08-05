import { Toaster } from "react-hot-toast";
import { Route } from "wouter";

import "./App.css";
import Header from "./components/header";
import CreatePaste from "./pages";
import Detail from "./pages/detail";
import Tutorial from "./pages/tutorial";

function App() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />
      <main role="main" className="pb-8">
        <Route path="/" component={CreatePaste}></Route>
        <Route path="/detail/:id" component={Detail} />
        <Route path="/tutorial" component={Tutorial} />
      </main>
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
}

export default App;
