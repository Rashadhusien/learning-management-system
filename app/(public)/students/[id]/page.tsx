// import React from "react";
// import { notFound } from "next/navigation";
// import { getStudentById } from "@/lib/actions/students.action";
// import { getStudentProjectSubmissions } from "@/lib/actions/project-submissions.action";
// import ProfileHeader from "@/components/ProfileHeader";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Separator } from "@/components/ui/separator";
// import {
//   Mail,
//   Phone,
//   Calendar,
//   Trophy,
//   Target,
//   BookOpen,
//   Star,
// } from "lucide-react";

// interface StudentProfilePageProps {
//   params: {
//     id: string;
//   };
// }

// const StudentProfilePage = async ({ params }: StudentProfilePageProps) => {
//   const { id } = params;

//   // Fetch student data
//   const studentResult = await getStudentById(id);

//   if (!studentResult.success || !studentResult.data) {
//     notFound();
//   }

//   const student = studentResult.data;

//   // Fetch student's project submissions
//   const submissionsResult = await getStudentProjectSubmissions();

//   const submissions = submissionsResult.success ? submissionsResult.data : [];

//   // Calculate stats
//   const approvedSubmissions = submissions.filter(
//     (s) => s.status === "approved",
//   ).length;
//   const pendingSubmissions = submissions.filter(
//     (s) => s.status === "pending",
//   ).length;
//   const rejectedSubmissions = submissions.filter(
//     (s) => s.status === "rejected",
//   ).length;

//   return (
//     <div className="container mx-auto px-4 py-8 space-y-8">
//       {/* Profile Header */}
//       <ProfileHeader userProfile={student} />

//       {/* Main Content */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//         {/* Left Column - Student Info & Stats */}
//         <div className="lg:col-span-1 space-y-6">
//           {/* About Section */}
//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <BookOpen className="w-5 h-5" />
//                 About
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               {student.bio && (
//                 <p className="text-muted-foreground">{student.bio}</p>
//               )}

//               <div className="space-y-3">
//                 <div className="flex items-center gap-3">
//                   <Mail className="w-4 h-4 text-muted-foreground" />
//                   <span className="text-sm">{student.email}</span>
//                 </div>

//                 {student.phone && (
//                   <div className="flex items-center gap-3">
//                     <Phone className="w-4 h-4 text-muted-foreground" />
//                     <span className="text-sm">{student.phone}</span>
//                   </div>
//                 )}

//                 <div className="flex items-center gap-3">
//                   <Calendar className="w-4 h-4 text-muted-foreground" />
//                   <span className="text-sm">
//                     Joined {new Date(student.createdAt).toLocaleDateString()}
//                   </span>
//                 </div>

//                 <div className="flex items-center gap-3">
//                   <Target className="w-4 h-4 text-muted-foreground" />
//                   <span className="text-sm">Level: {student.level}</span>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           {/* Stats Overview */}
//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center gap-2">
//                 <Trophy className="w-5 h-5" />
//                 Achievement Stats
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div className="grid grid-cols-2 gap-4">
//                 <div className="text-center p-4 bg-muted/50 rounded-lg">
//                   <div className="flex items-center justify-center gap-2 mb-2">
//                     <Trophy className="w-5 h-5 text-yellow-500" />
//                     <span className="text-2xl font-bold">
//                       {student.totalPoints}
//                     </span>
//                   </div>
//                   <p className="text-sm text-muted-foreground">Total Points</p>
//                 </div>

//                 <div className="text-center p-4 bg-muted/50 rounded-lg">
//                   <div className="flex items-center justify-center gap-2 mb-2">
//                     <Star className="w-5 h-5 text-blue-500" />
//                     <span className="text-2xl font-bold">
//                       {submissions.length}
//                     </span>
//                   </div>
//                   <p className="text-sm text-muted-foreground">
//                     Total Projects
//                   </p>
//                 </div>
//               </div>

//               <Separator />

//               <div className="space-y-3">
//                 <div className="flex items-center justify-between">
//                   <span className="text-sm text-muted-foreground">
//                     Approved
//                   </span>
//                   <Badge
//                     variant="default"
//                     className="bg-green-100 text-green-800"
//                   >
//                     {approvedSubmissions}
//                   </Badge>
//                 </div>

//                 <div className="flex items-center justify-between">
//                   <span className="text-sm text-muted-foreground">Pending</span>
//                   <Badge
//                     variant="secondary"
//                     className="bg-yellow-100 text-yellow-800"
//                   >
//                     {pendingSubmissions}
//                   </Badge>
//                 </div>

//                 <div className="flex items-center justify-between">
//                   <span className="text-sm text-muted-foreground">
//                     Rejected
//                   </span>
//                   <Badge
//                     variant="destructive"
//                     className="bg-red-100 text-red-800"
//                   >
//                     {rejectedSubmissions}
//                   </Badge>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Right Column - Project Submissions */}
//         <div className="lg:col-span-2">
//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center justify-between">
//                 <span className="flex items-center gap-2">
//                   <BookOpen className="w-5 h-5" />
//                   Project Submissions
//                 </span>
//                 <Badge variant="outline">{submissions.length} Total</Badge>
//               </CardTitle>
//             </CardHeader>
//             <CardContent>
//               {submissions.length === 0 ? (
//                 <div className="text-center py-12">
//                   <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
//                     <BookOpen className="w-8 h-8 text-muted-foreground" />
//                   </div>
//                   <h3 className="text-lg font-semibold mb-2">
//                     No Projects Yet
//                   </h3>
//                   <p className="text-muted-foreground">
//                     {student.name} hasn't submitted any projects yet.
//                   </p>
//                 </div>
//               ) : (
//                 <div className="space-y-4">
//                   {submissions.map((submission) => (
//                     <div
//                       key={submission.projectId}
//                       className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
//                     >
//                       <div className="flex items-start justify-between mb-3">
//                         <div>
//                           <h4 className="font-semibold">
//                             Project #{submission.projectId}
//                           </h4>
//                           <p className="text-sm text-muted-foreground">
//                             Submitted{" "}
//                             {new Date(
//                               submission.submittedAt,
//                             ).toLocaleDateString()}
//                           </p>
//                         </div>

//                         <Badge
//                           className={
//                             submission.status === "approved"
//                               ? "bg-green-100 text-green-800"
//                               : submission.status === "rejected"
//                                 ? "bg-red-100 text-red-800"
//                                 : "bg-yellow-100 text-yellow-800"
//                           }
//                         >
//                           {submission.status}
//                         </Badge>
//                       </div>

//                       <div className="flex items-center gap-4 text-sm text-muted-foreground">
//                         {submission.status === "approved" && (
//                           <div className="flex items-center gap-1">
//                             <Trophy className="w-4 h-4 text-yellow-500" />
//                             <span>
//                               {submission.pointsEarned || 0} points earned
//                             </span>
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default StudentProfilePage;
