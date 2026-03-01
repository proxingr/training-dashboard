// ===== Database Types for Training Management System =====

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  phone: string | null;
  role: 'admin' | 'facilitator' | 'participant';
  created_at: string;
  updated_at: string;
}

export interface LGA {
  id: string;
  name: string;
  code: string;
  created_at: string;
}

export interface Participant {
  id: string;
  lga_id: string | null;
  position: string | null;
  is_returning: boolean;
  prior_experience_years: number | null;
  hotel_preference: string | null;
  dietary_restrictions: string | null;
  meal_preferences: string | null;
  health_issues: string | null;
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;
  transportation_needs: string | null;
  pickup_location: string | null;
  registration_completed: boolean;
  onboarding_completed: boolean;
  assessments_completed: boolean;
  created_at: string;
  updated_at: string;
  lga_name: string | null;
  // Joined fields
  profiles?: Profile;
  lgas?: LGA;
}

export interface Training {
  id: string;
  name: string;
  description: string | null;
  start_date: string | null;
  end_date: string | null;
  location: string | null;
  budget: number | null;
  max_participants: number | null;
  status: string | null;
  created_at: string;
  updated_at: string;
}

export interface Session {
  id: string;
  training_id: string;
  title: string;
  description: string | null;
  session_date: string | null;
  start_time: string | null;
  end_time: string | null;
  facilitator_id: string | null;
  location: string | null;
  created_at: string;
  // Joined fields
  training?: Training;
  facilitator?: Profile;
  attendance?: Attendance[];
}

export interface Attendance {
  id: string;
  session_id: string;
  participant_id: string;
  checked_in_at: string | null;
  checked_out_at: string | null;
  notes: string | null;
  // Joined fields
  sessions?: Session;
  participants?: Participant & { profiles?: Profile };
}

export interface Assessment {
  id: string;
  participant_id: string;
  assessment_type: 'personality' | 'emotional_intelligence' | 'financial_behavior' | 'stress_resilience';
  is_pre_training: boolean;
  score: number | null;
  results: Record<string, unknown> | null;
  completed_at: string | null;
  created_at: string;
  // Joined fields
  participants?: Participant & { profiles?: Profile };
}

export interface Webinar {
  id: string;
  title: string;
  description: string | null;
  scheduled_date: string | null;
  duration_minutes: number | null;
  meeting_link: string | null;
  recording_link: string | null;
  created_at: string;
}

export interface WebinarAttendance {
  id: string;
  webinar_id: string;
  participant_id: string;
  joined_at: string | null;
  left_at: string | null;
}

export interface ActionPlan {
  id: string;
  participant_id: string;
  title: string;
  description: string | null;
  goals: Record<string, unknown> | null;
  timeline: string | null;
  submitted_at: string | null;
  last_updated: string | null;
}

export interface ProgressCheckin {
  id: string;
  participant_id: string;
  action_plan_id: string;
  checkin_date: string | null;
  progress_summary: string | null;
  challenges: string | null;
  achievements: string | null;
  next_steps: string | null;
  created_at: string;
}

export interface ImplementationTask {
  id: string;
  phase: 'pre_training' | 'training_execution' | 'post_training';
  title: string;
  description: string | null;
  assigned_to: string | null;
  due_date: string | null;
  priority: string | null;
  status: string | null;
  dependencies: Record<string, unknown> | null;
  notes: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

// ===== Dashboard Stats =====
export interface DashboardStats {
  totalParticipants: number;
  activeTrainings: number;
  upcomingSessions: number;
  completedAssessments: number;
}
