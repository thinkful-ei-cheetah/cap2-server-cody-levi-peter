class _Node {
  constructor(value, next, previous = null) {
    this.value = value;
    this.next = next;
    // this.previous = previous
  }
}

class LinkedList {
  constructor() {
    // all we have is a head
    this.head = null;
    this.length = 0
  }
  display(){
    if(!this.head) {
      return console.log('empty list')
    }
    // else if(!this.head.next){
    //   return console.log(this.head.value)
    // }
    else{
      let currNode = this.head
      while(currNode !== null){
        console.log(currNode.value)
        currNode = currNode.next
      }
      return null
    }
  }
  // Insertion (excluding inserting in the middle)
  insertFirst(item) {
    // create a node and point to curr head
    this.head = new _Node(item, this.head)
    this.length++
  }
  insertLast(item) {
    // empty list?
    if(this.head === null){
      this.insertFirst(item)
    }
    // loop till the end
    else {
      let currNode = this.head
      // let prevNode = this.head
      while(currNode.next !== null) {
        // prevNode = currNode
        currNode = currNode.next
      }
      // add a new node to the end
      currNode.next = new _Node(item, null)
      this.length++
      // prevNode.next = currNode
    }
  }
  moveNode(spaces){
    // remove the node from the sll
    let head = this.head
    this.head = this.head.next
    let currNode = this.head
    let prevNode = null
    // move however many spaces or till the end
    while(spaces > 0 && currNode !== null){
      prevNode = currNode
      currNode = currNode.next
      spaces--
    }
    prevNode.next = head
    head.next = currNode
  }
}

module.exports = LinkedList