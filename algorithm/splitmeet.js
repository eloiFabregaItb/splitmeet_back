// https://github.com/nadavgover/Splitwise/blob/master/README.md



class Queue {
  constructor() {
    this.elements = [];
  }

  enqueue(element) {
    this.elements.push(element); // Add element to the end of the array
  }

  dequeue() {
    return this.elements.shift(); // Remove element from the front of the array
  }

  isEmpty() {
    return this.elements.length === 0; // Check if the array is empty
  }

  front() {
    return !this.isEmpty() ? this.elements[0] : undefined; // Get the element at the front of the array
  }

  length() {
    return this.elements.length; // Get the number of elements in the array
  }
}


class Node {
  constructor(name, debt, flow = null, children = null, residual_capacity = null) {
      this.name = name;
      this.children = children;
      this.capacity = debt;
      this.flow = flow;
      this.parent = null;
      this.visited = false;
      this.residual_capacity = residual_capacity;
      this.flow_log = {};
      this.is_source = false
      this.is_sink = false
  }
}



class SplitIt{
  constructor(json_input){
    this.nodes = this._get_nodes(json_input)
    this.source = null
    this.sink = null
    this._make_graph()
    this._edmonds_karp()
  }

  _get_nodes(json_input){
    const nodes = []
    for (const person of json_input) {
      const node = new Node(person.name,person.amount)
      nodes.push( node )
    }
    return nodes
  }

  _make_graph(){
    const sources = this._find_source_nodes()
    const sinks = this._find_sink_nodes()

    if (sources.length === 0) {
      throw new Error("Nobody owes money, everything is settled up.\nOr there was a mistake in inputting the amount of money each one owes");
    }

    const source = this._make_big_source(sources)

    if (sinks.length === 0) {
      throw new Error("Nobody deserves to get anymore money, everything is settled up.\nOr there was a mistake in inputting the amount of money each one owes");
    }

    const sink = this._make_big_sink(sinks)

    this._initialize_graph()

    this.nodes.push(source,sink)
    this.source = source
    this.sink = sink

    // console.log(this.nodes.map(x=>({name:x.name,children:x?.children?.map(y=>y.name)})))

  }

  _initialize_graph(){
    for (const node of this.nodes) {
      for (const otherNode of this.nodes) {
        //refactor this outside inner bucle
        if(node !== otherNode){
          if(!node.children){
            node.children = []
          }
          if(!node.flow){
            node.flow = 0
          }
          if(!node.residual_capacity){
            node.residual_capacity = Infinity
          }
          node.children.push(otherNode)
        }
      }
      
    }
  }


  _find_source_nodes(){
    /*Encuentra los nodos fuente del grafo (puede haber más de uno).
    Entrada: Lista de nodos
    Salida: Lista de nodos que son fuentes del grafo (que deben dinero)
    Si la deuda es negativa, significa que la persona debe dinero y es flujo hacia adentro en la red */
    return this.nodes.filter(node => node.capacity < 0)

  }

  _make_big_source(sources){
    /*Joins all the sources to one big source.
      Since the max-flow algorithm works on one source, we need to join all the small sources into one.
      The big source will be considered as the source of the graph 
    */

    const debtArray = sources.map(source => Math.abs(source.capacity))
    const flowArray = sources.map(() => 0)
    const residualCapacityArray = sources.map(source => Math.abs(source.capacity))
  
    const bigSource = new Node("source",debtArray,flowArray,sources,residualCapacityArray)
    bigSource.is_source = true

    for (const source of sources) {
      source.capacity = Infinity
      source.residual_capacity = Infinity
    }

    return bigSource
  }

  _find_sink_nodes(){
    /*Encuentra los nodos sumidero del grafo (puede haber más de uno).
    Entrada: Lista de nodos
    Salida: Lista de nodos que son sumideros del grafo (que necesitan recuperar dinero)
    Si la deuda es positiva, significa que la persona necesita recuperar dinero y es un flujo saliente de la red */
    return this.nodes.filter(node => node.capacity > 0)
  }

  _make_big_sink(sinks){
    /*Joins all the sinks to one big sink.
    Since the max-flow algorithm works on one sink, we need to join all the small sinks into one.
    The big sink will be considered as the sink of the graph */
    
    const bigSink = new Node("sink",Infinity,0,null,Infinity)
    bigSink.is_sink = true

    for (const sink of sinks) {
      sink.children = [bigSink]
      sink.residual_capacity = sink.capacity
      sink.flow = 0
    }

    return bigSink
  }

  _BFS(source=null,sink=null,nodes=null){
    /*Breadth first search (BFS).
    Finds a path between source and sink and returns it. If no path is found returns false */

    if(!source) source = this.source
    if(!sink) sink = this.sink
    if(!nodes) nodes = this.nodes

    for (const node of nodes) {
      node.visited = false
    }

    const q = new Queue()
    q.enqueue(source)
    source.visited = true

    while (! q.isEmpty() ){
      const currentNode = q.dequeue()
      const children = currentNode.children || []

      for(let i=0;i<children.length;i++){
        const child = children[i]
        let residualCapacity
        if(currentNode.is_source){
          residualCapacity = currentNode.residual_capacity[i]
        }else{
          residualCapacity = child.residual_capacity
        }

        if(child.name === sink.name){
          return this._extract_path_from_bfs(currentNode,source,sink)
        }
        if(!child.visited && residualCapacity > 0){
          child.visited = true
          child.parent = currentNode
          q.enqueue(child)
        }

      }

    }
    return []
  }



  _extract_path_from_bfs(node,source,sink){
    const path = [sink]

    while (node.parent){
      path.push(node)
      node = node.parent
    }
    path.push(source)
    return path.toReversed()
  }

  _edmonds_karp(){
    /*Finds the max-flow of the graph */
    let maxFlow = 0
    let path = this._BFS(this.source,this.sink)
    while(path.length > 0){ //while there is a path in the residual graph between the source and the sink
      const minResidualCapacity = this._find_min_residual_capacity_in_path(path)
      maxFlow += minResidualCapacity
      this._send_flow_along_path(path, minResidualCapacity)
      path = this._BFS(this.source,this.sink)
    }

    return maxFlow
  }

  _find_min_residual_capacity_in_path(path){
    //Finds the minimum residual capacity of a path
    const residualCapacities = []
    for (const node of path) {
      if(node.is_source){
        const smallSource = path[1] //# the small source is the source that the big source was comprised of that is part of the path
        const index = node.children.indexOf(smallSource)
        residualCapacities.push(node.residual_capacity[index])
      }else{
        residualCapacities.push(node.residual_capacity)
      }
    }

    return Math.min(...residualCapacities)
  }

  _send_flow_along_path(path, flowAmount){
    for(let i=0;i<path.length;i++){
      const node = path[i]

      if(node.is_source){
        // The source might have more than one child with a capacity, so we need to check who it is that is in the path
        // in order to add flow to it
        const smallSource = path[i+1]// the small source is the source that the big source was comprised of that is part of the path
        const index = node.children.indexOf(smallSource)
        node.flow[index] += flowAmount
        node.residual_capacity[index] = node.capacity[index] - node.flow[index]

      }else{
        if(node.is_sink){
          continue
        }
        node.flow += flowAmount
        node.residual_capacity = node.capacity - node.flow
      }

      if(!node.is_sink){
        const existingFlow = node.flow_log[path[i + 1].name] || 0
        node.flow_log[path[i+1].name] = existingFlow + flowAmount
      }
    }
  }

  get_transactions(){
    const result = []

    for (const node of this.nodes) {
      for (const to_name in node.flow_log) {
        const to_node = this.nodes.find(x=>x.name = to_name)
        const from_name = node.name
        const amount = node.flow_log[to_name]
        // const to_name = to_node.name

        if(to_name === "sink" || to_node.is_sink || node.is_source){ //# don't print the sink since this is artificial in the graph
          continue
        }

        result.push({from:from_name,amount,to:to_name})
      }
      
    }
    return result
  }
}



















export function simplifyTransactionMatrix(matrix,users){
  const transactions = convertMatrixToTransactions({debts:matrix,users});
  let splitit = new SplitIt(transactions);
  let transactions_solved = splitit.get_transactions();

  return transactions_solved
}




function convertMatrixToTransactions(matrix) {
  const names = matrix.users.map(x=>x.id);
  const debts = matrix.debts;
  const transactions = [];

  // Calculate total amount paid
  let totalAmount = 0;
  for (let i = 0; i < names.length; i++) {
      for (let j = i + 1; j < names.length; j++) {
          totalAmount += debts[i][j];
      }
  }
  totalAmount = Math.abs(totalAmount)

  // Calculate amount each person should have paid
  const duePerPerson = totalAmount / names.length;

  // Calculate difference for each person
  const differences = [];
  for (let i = 0; i < names.length; i++) {
      let totalCredit = 0;
      for (let j = 0; j < names.length; j++) {
          totalCredit += debts[j][i];
      }
      differences.push(totalCredit);
  }

  // Generate transactions
  for (let i = 0; i < names.length; i++) {
      const name = names[i];
      const amount = differences[i];
      transactions.push({ name, amount });
  }

  return transactions;
}






















function main() {
  let json_data = [
      {
          "name": "Alice",
          "amount": 20
      },
      {
          "name": "Bob",
          "amount": -10
      },
      {
          "name": "Charlie",
          "amount": -5
      },
      {
          "name": "David",
          "amount": 15
      }
  ];

  let splitit = new SplitIt(json_data);
  let transactions = splitit.get_transactions();
  console.log(transactions);
}




// main();

