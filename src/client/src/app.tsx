import { h } from "preact"



interface Props
{
    name: string
}


export function App (props: Props)
{
    return <div>Hello {props.name}</div>
}
