import { prisma } from "@/lib/prisma";

export async function getTeacherByUserId(userId: string) {
  return prisma.teacher.findUnique({
    where: { userId },
    include: { user: true },
  });
}

export async function getTeacherDashboardData(teacherId: string) {
  const [courses, recentSubmissions, totalStudentsResult] = await Promise.all([
    prisma.course.findMany({
      where: { teacherId },
      include: { enrollments: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.submission.findMany({
      where: { assignment: { teacherId } },
      include: { student: { include: { user: true } }, assignment: true },
      orderBy: { submittedAt: "desc" },
      take: 8,
    }),
    prisma.enrollment.findMany({
      where: { course: { teacherId }, status: "ACTIVE" },
      select: { studentId: true },
      distinct: ["studentId"],
    }),
  ]);

  const pendingGrading = await prisma.submission.count({
    where: { assignment: { teacherId }, status: "SUBMITTED" },
  });

  return {
    courses,
    recentSubmissions,
    totalStudents: totalStudentsResult.length,
    pendingGrading,
  };
}

export async function getTeacherStudents(teacherId: string) {
  const enrollments = await prisma.enrollment.findMany({
    where: { course: { teacherId } },
    include: {
      student: { include: { user: true } },
      course: true,
    },
    orderBy: { startedAt: "desc" },
  });

  // Group by student
  const studentMap = new Map<
    string,
    { student: (typeof enrollments)[number]["student"]; courses: string[]; enrollmentIds: string[] }
  >();

  for (const e of enrollments) {
    const existing = studentMap.get(e.studentId);
    if (existing) {
      existing.courses.push(e.course.title);
      existing.enrollmentIds.push(e.id);
    } else {
      studentMap.set(e.studentId, {
        student: e.student,
        courses: [e.course.title],
        enrollmentIds: [e.id],
      });
    }
  }

  return Array.from(studentMap.values());
}

export async function getTeacherStudentDetail(teacherId: string, studentId: string) {
  const enrollments = await prisma.enrollment.findMany({
    where: { studentId, course: { teacherId } },
    include: { course: true },
  });

  if (enrollments.length === 0) return null;

  const student = await prisma.student.findUnique({
    where: { id: studentId },
    include: { user: true },
  });

  const submissions = await prisma.submission.findMany({
    where: { studentId, assignment: { teacherId } },
    include: { assignment: true },
    orderBy: { submittedAt: "desc" },
  });

  const attendance = await prisma.attendance.findMany({
    where: { studentId, teacherId },
    orderBy: { date: "desc" },
    take: 20,
  });

  return { student, enrollments, submissions, attendance };
}

export async function getTeacherCourses(teacherId: string) {
  return prisma.course.findMany({
    where: { teacherId },
    include: {
      modules: { include: { lessons: true }, orderBy: { order: "asc" } },
      lessons: true,
    },
    orderBy: { title: "asc" },
  });
}

export async function getTeacherLessons(teacherId: string) {
  return prisma.lesson.findMany({
    where: { teacherId },
    include: { course: true, module: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getTeacherAssignments(teacherId: string) {
  return prisma.assignment.findMany({
    where: { teacherId },
    include: {
      lesson: { include: { course: true } },
      submissions: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getAssignmentWithSubmissions(teacherId: string, assignmentId: string) {
  return prisma.assignment.findFirst({
    where: { id: assignmentId, teacherId },
    include: {
      lesson: { include: { course: true } },
      submissions: { include: { student: { include: { user: true } } }, orderBy: { submittedAt: "desc" } },
    },
  });
}

export async function getTeacherEnrolledStudentsForCourse(courseId: string) {
  return prisma.enrollment.findMany({
    where: { courseId, status: "ACTIVE" },
    include: { student: { include: { user: true } } },
  });
}
