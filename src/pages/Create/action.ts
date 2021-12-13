import React, {useState} from "react"

export enum CreateAction {
  Editing,
  Confirmed
}
export const CreateActionContext = React.createContext({
  action: CreateAction.Editing,
  setEditing () {},
  setConfirmed () {}
})

export const useCreateAction = (initAction: CreateAction) => {
  const [action, setAction] = useState(initAction)
  return {
    action,
    setEditing () {
      setAction(CreateAction.Editing)
    },
    setConfirmed () {
      setAction(CreateAction.Confirmed)
    }
  }
}


