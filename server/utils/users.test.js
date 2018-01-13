const expect = require("expect");
const { Users } = require("./users");

describe("Users", () => {
  let users;
  beforeEach(() => {
    users = new Users();
    users.users = [
      {
        id: "1",
        name: "Mike",
        room: "Node Course"
      },
      {
        id: "2",
        name: "Jen",
        room: "React Course"
      },
      {
        id: "3",
        name: "Julie",
        room: "Node Course"
      }
    ];
  });

  it("should add new user", () => {
    const users = new Users();
    const user = {
      id: "123",
      name: "Andrew",
      room: "Peaky Blinders"
    };

    const resUser = users.addUser(user.id, user.name, user.room);

    expect(users.users).toEqual([user]);
  });

  it("should remove user from users", () => {
    const userRemoved = users.removeUser("1");
    expect(users.users).toEqual([
      {
        id: "2",
        name: "Jen",
        room: "React Course"
      },
      {
        id: "3",
        name: "Julie",
        room: "Node Course"
      }
    ]);
    expect(userRemoved).toEqual({
      id: "1",
      name: "Mike",
      room: "Node Course"
    });
  });

  it("should not remove user", () => {
    const userRemoved = users.removeUser("4");
    const initialUsers = users.users;
    expect(users.users).toEqual(initialUsers);
    expect(userRemoved).toBe(undefined);
  });

  it("should find user", () => {
    const user = users.getUser("1");
    expect(user.id).toEqual("1");
  });

  it("should not find user", () => {
    const user = users.getUser("4");
    expect(user).toBeFalsy();
  });

  it("should return name for users node course", () => {
    const usersList = users.getUserList("Node Course");
    expect(usersList).toEqual(["Mike", "Julie"]);
  });

  it("should retrun name for users react course", () => {
    const usersList = users.getUserList("React Course");
    expect(usersList).toEqual(["Jen"]);
  });
});
