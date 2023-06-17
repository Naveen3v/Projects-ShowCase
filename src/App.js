import {Component} from 'react'

import Loader from 'react-loader-spinner'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'
import ProjectsItem from './components/ProjectsItem'

import './App.css'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class App extends Component {
  state = {
    activeTabId: categoriesList[0].id,
    projectsList: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getLists()
  }

  getLists = async () => {
    const {activeTabId} = this.state
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const url = `https://apis.ccbp.in/ps/projects?category=${activeTabId}`
    const response = await fetch(url)
    const data = await response.json()
    if (response.ok === true) {
      const updatedData = data.projects.map(each => ({
        id: each.id,
        name: each.name,
        imageUrl: each.image_url,
      }))
      this.setState({
        projectsList: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  retry = () => {
    this.getLists()
  }

  changeOption = event => {
    this.setState({activeTabId: event.target.value}, this.getLists)
  }

  Loading = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="TailSpin" color="#4094EF" height={50} width={50} />
    </div>
  )

  Success = () => {
    const {projectsList} = this.state
    return (
      <ul className="ul-cont">
        {projectsList.map(each => (
          <ProjectsItem projectDetails={each} key={each.id} />
        ))}
      </ul>
    )
  }

  Failure = () => (
    <div className="failure">
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
        className="fimg"
      />
      <h1 className="fi-heading">Oops! Something Went Wrong</h1>
      <p className="fi-para">
        We cannot seem to find the page you are looking for
      </p>
      <button type="button" className="btn" onClick={this.retry}>
        Retry
      </button>
    </div>
  )

  display = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.Success()
      case apiStatusConstants.failure:
        return this.Failure()
      case apiStatusConstants.inProgress:
        return this.Loading()
      default:
        return null
    }
  }

  render() {
    const {activeTabId} = this.state
    return (
      <div className="container">
        <div className="header">
          <img
            src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
            alt="website logo"
            className="logo"
          />
        </div>
        <div className="sel-cont">
          <select
            value={activeTabId}
            className="select"
            onChange={this.changeOption}
          >
            {categoriesList.map(each => (
              <option value={each.id} key={each.id}>
                {each.displayText}
              </option>
            ))}
          </select>
          {this.display()}
        </div>
      </div>
    )
  }
}

export default App
