const User = require('../../models/user.model');

async function findAll() {
  return await User.find().select('-password').lean();
}

async function findById(id) {
  return await User.findById(id).select('-password').lean();
}

async function findByEmail(email) {
  return await User.findOne({ email: email.toLowerCase() });
}

async function create(userData) {
  const user = new User(userData);
  const saved = await user.save();
  const u = saved.toObject();
  delete u.password;
  return u;
}

async function update(id, updateData) {
  const updated = await User.findByIdAndUpdate(id, updateData, { new: true }).select('-password').lean();
  return updated;
}

async function remove(id) {
  return await User.findByIdAndDelete(id).lean();
}

// ✅ Nuevo método para cambiar la contraseña
async function updatePassword(userId, newHashedPassword) {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { password: newHashedPassword },
      { new: true }
    ).lean();
    return updatedUser;
  } catch (error) {
    console.error('Error al actualizar contraseña:', error);
    throw error;
  }
}

module.exports = {
  findAll,
  findById,
  findByEmail,
  create,
  update,
  remove,
  updatePassword // 👈 agregado
};
