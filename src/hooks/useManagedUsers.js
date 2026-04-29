import { useEffect, useState } from 'react';
import {
  createManagedUser,
  deleteManagedUser,
  getManagedUsers,
  updateManagedUserRole,
} from '../services/usersService.js';
import { getFriendlyError } from '../utils/errors.js';

export function useManagedUsers(ownerId) {
  const [managedUsers, setManagedUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [usersMessage, setUsersMessage] = useState('');
  const [usersError, setUsersError] = useState('');

  async function loadManagedUsers() {
    try {
      setUsersLoading(true);
      setUsersError('');
      const data = await getManagedUsers(ownerId);
      setManagedUsers(data);
    } catch (err) {
      setUsersError(getFriendlyError(err));
    } finally {
      setUsersLoading(false);
    }
  }

  useEffect(() => {
    if (ownerId) loadManagedUsers();
  }, [ownerId]);

  async function addManagedUser(user) {
    try {
      setUsersError('');
      setUsersMessage('');
      const newUser = await createManagedUser({ ...user, ownerId });
      setManagedUsers((current) => [newUser, ...current]);
      setUsersMessage('Utilisateur ajoute.');
      return true;
    } catch (err) {
      setUsersError(getFriendlyError(err));
      return false;
    }
  }

  async function changeManagedUserRole(id, role) {
    try {
      setUsersError('');
      setUsersMessage('');
      const savedUser = await updateManagedUserRole({ id, role });
      setManagedUsers((current) => current.map((item) => (item.id === savedUser.id ? savedUser : item)));
      setUsersMessage('Role mis a jour.');
    } catch (err) {
      setUsersError(getFriendlyError(err));
    }
  }

  async function removeManagedUser(id) {
    try {
      setUsersError('');
      setUsersMessage('');
      await deleteManagedUser(id);
      setManagedUsers((current) => current.filter((item) => item.id !== id));
      setUsersMessage('Utilisateur supprime.');
    } catch (err) {
      setUsersError(getFriendlyError(err));
    }
  }

  return {
    managedUsers,
    usersLoading,
    usersMessage,
    usersError,
    addManagedUser,
    changeManagedUserRole,
    removeManagedUser,
  };
}
