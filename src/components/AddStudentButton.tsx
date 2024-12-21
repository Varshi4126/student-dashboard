import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { NewStudent } from '@/types/student';

interface AddStudentButtonProps {
  onAddStudent: (student: NewStudent) => Promise<void>;
}

export default function AddStudentButton({ onAddStudent }: AddStudentButtonProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<NewStudent>({
    name: '',
    cohort: 'AY 2024-25',
    courses: ['CBSE 9 Science'],
    status: 'active',
    dateJoined: new Date().toISOString(),
    lastLogin: new Date().toISOString()
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      if (!formData.name.trim()) {
        throw new Error('Student name is required');
      }
      
      await onAddStudent({
        ...formData,
        dateJoined: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      });
      
      setOpen(false);
      setFormData({
        name: '',
        cohort: 'AY 2024-25',
        courses: ['CBSE 9 Science'],
        status: 'active',
        dateJoined: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      });
    } catch (err) {
      console.error('Error adding student:', err);
      setError(err instanceof Error ? err.message : 'Failed to add student');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          + Add new Student
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Student</DialogTitle>
          <DialogDescription>
            Enter the details of the new student below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="name">Student Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="cohort">Cohort</Label>
            <Select 
              value={formData.cohort}
              onValueChange={(value) => setFormData(prev => ({ ...prev, cohort: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select cohort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AY 2024-25">AY 2024-25</SelectItem>
                <SelectItem value="AY 2023-24">AY 2023-24</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="courses">Courses</Label>
            <Select
              value={formData.courses[0]}
              onValueChange={(value) => setFormData(prev => ({ ...prev, courses: [value] }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select course" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CBSE 9 Science">CBSE 9 Science</SelectItem>
                <SelectItem value="CBSE 9 Math">CBSE 9 Math</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={isLoading}
            >
              {isLoading ? 'Adding...' : 'Add Student'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}