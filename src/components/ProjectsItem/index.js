import './index.css'

const ProjectsItem = props => {
  const {projectDetails} = props
  const {id, name, imageUrl} = projectDetails
  return (
    <li className="li-item">
      <img src={imageUrl} alt={name} className="list-img" />
      <p className="list-para">{name}</p>
    </li>
  )
}

export default ProjectsItem
