import { useState, useEffect } from 'react';
import { getUserGroups, getGroupContributions } from '../services/firestore';
import { useAuth } from '../contexts/AuthContext';

export const useGroups = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchGroups();
    }
  }, [user]);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const userGroups = await getUserGroups(user.uid);
      setGroups(userGroups);
    } catch (error) {
      console.error('Error fetching groups:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshGroups = () => {
    fetchGroups();
  };

  return { groups, loading, refreshGroups };
};

export const useGroupContributions = (groupId) => {
  const [contributions, setContributions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (groupId) {
      fetchContributions();
    }
  }, [groupId]);

  const fetchContributions = async () => {
    try {
      setLoading(true);
      const groupContributions = await getGroupContributions(groupId);
      setContributions(groupContributions);
    } catch (error) {
      console.error('Error fetching contributions:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshContributions = () => {
    fetchContributions();
  };

  return { contributions, loading, refreshContributions };
};