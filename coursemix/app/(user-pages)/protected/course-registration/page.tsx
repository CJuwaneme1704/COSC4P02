import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { getCurrentTerm, getCurrentDateET } from "@/utils/date-utils";
import { TermInfo } from "@/types";
import CourseSearch from "@/components/course-registration/CourseSearch";

export default async function CourseRegistrationPage() {
  const supabase = await createClient();

  // Get the user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Fetch user profile
  const { data: userProfile } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (!userProfile) {
    return redirect("/protected/profile-setup");
  }

  // Get the current term information
  const termInfo: TermInfo = getCurrentTerm();
  const currentYear = new Date(getCurrentDateET()).getFullYear();
  
  // Map the term to the format used in the database
  const termMap: Record<string, string> = {
    'WINTER': 'Winter',
    'FALL': 'Fall',
    'SPRING': 'Spring',
    'SUMMER': 'Summer'
  };
  const currentTerm = termMap[termInfo.term];
  const displayTerm = `${currentTerm} ${currentYear}`;

  return (
    <main className="bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen py-6">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Course Registration</h1>
          <p className="text-gray-600 mt-2">
            Register for courses for the {displayTerm} term
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <CourseSearch 
            userId={user.id} 
            term={currentTerm} 
            year={currentYear} 
          />
        </div>
      </div>
    </main>
  );
} 