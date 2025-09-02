const mongoose = require('mongoose');
const DashboardStat = require('./models/DashboardStat');
const Project = require('./models/Project');
const Skill = require('./models/Skill');
const User = require('./models/User');

mongoose.connect('mongodb://localhost:27017/myDashboardDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const seedData = async () => {
  try {
    // Clear existing data
    await DashboardStat.deleteMany({});
    await Project.deleteMany({});
    await Skill.deleteMany({});
    await User.deleteMany({});

    // Create users
    const users = await User.create([
      { name: 'Alice', email: 'alice@example.com', isActive: true },
      { name: 'Bob', email: 'bob@example.com', isActive: false },
      { name: 'Charlie', email: 'charlie@example.com', isActive: true },
    ]);

    // Create dashboard stats
    await DashboardStat.create([
      { title: 'Total Users', value: users.length },
      { title: 'Active Users', value: users.filter(u => u.isActive).length },
    ]);

    // Create projects
    await Project.create([
      { name: 'Project 1', description: 'First project description' },
      { name: 'Project 2', description: 'Second project description' },
    ]);

    // Create skills
    await Skill.create([
      { name: 'JavaScript' },
      { name: 'Node.js' },
      { name: 'MongoDB' },
    ]);

    console.log('✅ Seed data inserted successfully');
  } catch (err) {
    console.error('Seed error:', err);
  } finally {
    mongoose.connection.close();
  }
};

seedData();
