/**
 * The utility for create react component habitat.
 * @author imcuttle
 */
import * as React from 'react'

type DOMCombine = VDom | HTMLElement
type VDom = {
  readonly dom: HTMLElement
  data: (key: string | Symbol, value?: any) => void
  get: (key?: string) => any
  isEqual: (dom: DOMCombine) => boolean
}

type NumberOrDOM = number | DOMCombine

type PizzaResult = {
  readonly origin: React.ComponentType
  indexOf: (dom: DOMCombine) => number
  setProps: (props: any, indexOrDom: NumberOrDOM) => void
  remove: (indexOrDom: NumberOrDOM) => void
  get: (indexOrDom: NumberOrDOM) => VDom
  get: () => VDom[]
  ref: (indexOrDom: NumberOrDOM) => React.Ref
  ref: () => React.Ref[]
  call: (methodName: String | Symbol, argvs: any[], indexOrDom: NumberOrDOM) => any
  call: (methodName: String | Symbol, argvs: any[]) => any[]
  call: (attrName: String | Symbol, indexOrDom: NumberOrDOM) => any
  call: (attrName: String | Symbol) => any[]
}

type PizzaRender<P> = ((selector: HTMLElement | NodeList | string | HTMLElement[], props: P) => PizzaResult) & {
  origin: React.ComponentType
}

type Pizza = (Component: React.ComponentType) => PizzaRender

export = Pizza
