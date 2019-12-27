import Component from "./Component";

export default interface IComponentConstructor{
    new (...args: any): Component;
}