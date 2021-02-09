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

type PizzaResult<R> = {
  readonly origin: React.ComponentType
  indexOf: (dom: DOMCombine) => number
  setProps: (props: any, indexOrDom: NumberOrDOM) => void
  remove: (indexOrDom: NumberOrDOM) => void
  get(indexOrDom: NumberOrDOM): VDom
  get(): VDom[]
  ref(indexOrDom: NumberOrDOM): React.Ref<R>
  ref(): React.Ref<R>[]
  call(methodName: String | Symbol, argvs: any[], indexOrDom: NumberOrDOM): any
  call(methodName: String | Symbol, argvs: any[]): any[]
  call(attrName: String | Symbol, indexOrDom: NumberOrDOM): any
  call(attrName: String | Symbol): any[]
}

type PizzaRender<P, R> = ((selector: HTMLElement | NodeList | string | HTMLElement[], props: P) => PizzaResult<R>) & {
  origin: React.ComponentType
}

type Pizza<P, R> = (Component: React.ComponentType<P>) => PizzaRender<P, R>

declare var pizza: Pizza<any, any>
export = pizza
