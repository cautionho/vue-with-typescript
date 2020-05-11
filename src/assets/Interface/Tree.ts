namespace Interface {
  export class TreeNode {
    Id: number | string
    Title: string
    Children: TreeNode[]
    IsExpand?: boolean
    IsActive?: boolean
    [key: string]: any
  }
}

export default Interface 