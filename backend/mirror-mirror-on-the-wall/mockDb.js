// Simple in-memory user store for testing without MongoDB
class MockUserStore {
  constructor() {
    this.users = [];
    this.nextId = 1;
  }

  async findOne(query) {
    return Promise.resolve(this.users.find(user => 
      query.username ? user.username === query.username : 
      query._id ? user._id === query._id : false
    ));
  }

  async save(userData) {
    const existingUser = await this.findOne({ username: userData.username });
    if (existingUser) {
      throw new Error('User already exists');
    }
    
    const user = {
      _id: this.nextId++,
      ...userData,
      createdAt: new Date()
    };
    
    this.users.push(user);
    return Promise.resolve(user);
  }

  async findById(id) {
    return Promise.resolve(this.users.find(user => user._id === id));
  }
}

module.exports = new MockUserStore();
