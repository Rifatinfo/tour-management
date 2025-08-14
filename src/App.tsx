import { Outlet } from 'react-router'
import './App.css'
import CommonLayout from './components/layout/CommonLayout'

function App() {

  return (
    <>
      <div>
        <CommonLayout>
          <Outlet />
        </CommonLayout>
      </div>
    </>
  )
}

export default App
