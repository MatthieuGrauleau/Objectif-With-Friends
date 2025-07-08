import React, { useState } from 'react';
import { addContribution } from '../../services/firestore';
import { useAuth } from '../../contexts/AuthContext';
import { validateAmount } from '../../utils/validators';
import Input from '../ui/Input';
import Button from '../ui/Button';

const AddContribution = ({ groupId, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    amount: '',
    description: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!validateAmount(formData.amount)) {
      newErrors.amount = 'Le montant doit être un nombre positif';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      const contributionData = {
        groupId,
        userId: user.uid,
        userName: user.displayName || user.email,
        amount: parseFloat(formData.amount),
        description: formData.description
      };

      await addContribution(contributionData);
      onSuccess();
    } catch (error) {
      setErrors({ general: 'Erreur lors de l\'ajout de la contribution' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Montant"
        type="number"
        name="amount"
        value={formData.amount}
        onChange={handleChange}
        placeholder="100"
        required
        error={errors.amount}
      />
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description (optionnel)
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Économies du mois..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          rows="3"
        />
      </div>

      {errors.general && (
        <div className="text-red-500 text-sm">
          {errors.general}
        </div>
      )}

      <div className="flex gap-2">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          className="flex-1"
        >
          Annuler
        </Button>
        <Button
          type="submit"
          disabled={loading}
          className="flex-1"
        >
          {loading ? 'Ajout...' : 'Ajouter'}
        </Button>
      </div>
    </form>
  );
};

export default AddContribution;