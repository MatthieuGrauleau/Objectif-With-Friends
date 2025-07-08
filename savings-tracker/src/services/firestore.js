import { 
    collection, 
    addDoc, 
    getDocs, 
    doc, 
    updateDoc, 
    arrayUnion, 
    query, 
    where, 
    orderBy,
    Timestamp
  } from 'firebase/firestore';
  import { db } from './firebase';
  
  // Groupes
  export const createGroup = async (groupData, userId) => {
    try {
      const docRef = await addDoc(collection(db, 'groups'), {
        ...groupData,
        members: [userId],
        createdBy: userId,
        createdAt: Timestamp.now()
      });
      return docRef.id;
    } catch (error) {
      throw new Error(error.message);
    }
  };
  
  export const getUserGroups = async (userId) => {
    try {
      const q = query(
        collection(db, 'groups'),
        where('members', 'array-contains', userId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      throw new Error(error.message);
    }
  };
  
  export const joinGroup = async (groupId, userId) => {
    try {
      const groupRef = doc(db, 'groups', groupId);
      await updateDoc(groupRef, {
        members: arrayUnion(userId)
      });
    } catch (error) {
      throw new Error(error.message);
    }
  };
  
  // Contributions
  export const addContribution = async (contributionData) => {
    try {
      const docRef = await addDoc(collection(db, 'contributions'), {
        ...contributionData,
        createdAt: Timestamp.now()
      });
      return docRef.id;
    } catch (error) {
      throw new Error(error.message);
    }
  };
  
  export const getGroupContributions = async (groupId) => {
    try {
      const q = query(
        collection(db, 'contributions'),
        where('groupId', '==', groupId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      throw new Error(error.message);
    }
  };