class Users {
  constructor() {
    this.users = [];
  }

  addUser(id, name, room) {
    const user = { id, name, room };
    this.users = [...this.users, user];
    return user;
  }

  removeUser(id) {
    const user = this.users.find(user => user.id === id);
    this.users = this.users.filter(user => user.id !== id);
    return user;
  }

  getUser(id) {
    return this.users.filter(user => user.id === id)[0];
  }

  getUserList(room) {
    return this.users.filter(user => user.room === room).map(user => user.name);
  }
}

module.exports = { Users };

// class Person {
//   constructor(name, age) {
//     this.name = name;
//     this.age = age;
//   }

//   getUserDescription() {
//     return `${this.name} is ${this.age} years old.`;
//   }
// }

// const me = new Person("Jen", 25);
// const description = me.getUserDescription();
