import React, { useState } from 'react';
import { createGroup } from '../../services/firestore';
import { useAuth } from '../../contexts/AuthContext';
import { validateGroupName, validateAmount, validateTargetDate } from '../../utils/validators';
import Input from '../ui/Input';
import Button from '../ui/Button';

const CreateGroup = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    targetAmount: '',
    targetDate: '',
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

    if (!validateGroupName(formData.name)) {
      newErrors.name = 'Le nom du groupe doit contenir au moins 3 caractères';
    }

    if (!validateAmount(formData.targetAmount)) {
      newErrors.targetAmount = 'Le montant doit être un nombre positif';
    }

    if (!validateTargetDate(formData.targetDate)) {
      newErrors.targetDate = 'La date limite doit être dans le futur';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      const groupData = {
        name: formData.name,
        targetAmount: parseFloat(formData.targetAmount),
        targetDate: formData.targetDate,
        description: formData.description
      };

      await createGroup(groupData, user.uid);
      onSuccess();
    } catch (error) {
      setErrors({ general: 'Erreur lors de la création du groupe' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Nom du groupe"
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Voyage à Bali"
        required
        error={errors.name}
      />
      
      <Input
        label="Montant objectif par personne"
        type="number"
        name="targetAmount"
        value={formData.targetAmount}
        onChange={handleChange}
        placeholder="1000"
        required
        error={errors.targetAmount}
      />
      
      <Input
        label="Date limite"
        type="date"
        name="targetDate"
        value={formData.targetDate}
        onChange={handleChange}
        required
        error={errors.targetDate}
      />
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description (optionnel)
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Décrivez votre projet..."
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
          {loading ? 'Création...' : 'Créer le groupe'}
        </Button>
      </div>
    </form>
  );
};

export default CreateGroup;