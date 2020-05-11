import PInterface from '../Interface/Public';

class Resources {
	public Menu: PInterface.Resource[] = []
	public Point: PInterface.Resource[] = []
	public SetResources(arg: PInterface.Resources): void {
    this.Menu = []
    this.Point = []
		this.Menu.push(...arg.Menu);
		this.Point.push(...arg.Point);
	}
}

export default Resources
