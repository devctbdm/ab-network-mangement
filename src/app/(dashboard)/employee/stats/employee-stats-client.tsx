"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Gift, CheckCircle2, Clock, Banknote, CalendarCheck, CalendarX, CalendarDays } from "lucide-react";
import { format } from "date-fns";
import { formatCurrency } from "@/lib/constants";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

interface StatsData {
  name: string;
  email: string;
  monthlySalary: number;
  presentDays: number;
  absentDays: number;
  halfDays: number;
  daysInMonth: number;
  dailyRate: number;
  leaveQuota: number;
  usedLeaves: number;
  leaveRemaining: number;
  totalAdvance: number;
  advanceList: Array<{
    amount: number;
    reason: string | null;
    requestedAt: Date;
    status: string;
  }>;
  eidBonus: number;
  eidBonusPaid: boolean;
  eidBonusPaidAt: Date | null;
  eidBonusFestivalName: string | null;
  salaryPaid: boolean;
  salaryPaidAt: Date | null;
  attendanceDeduction: number;
  netSalary: number;
  salaryHistory: Array<{
    month: string;
    netPayable: number;
    eidBonus: number;
    paid: boolean;
    paidAt: Date | string | null;
  }>;
  year: number;
  month: number;
}

export function EmployeeStatsClient({
  session,
  initialData,
}: {
  session: any;
  initialData: StatsData;
}) {
  const [data] = useState(initialData);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const attendanceRate =
    data.daysInMonth > 0
      ? ((data.presentDays + data.halfDays * 0.5) / data.daysInMonth) * 100
      : 0;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="p-4 md:p-6 space-y-6"
    >
      <motion.div variants={fadeInUp}>
        <h1 className="text-2xl font-bold">My Salary & Attendance</h1>
        <p className="text-muted-foreground">
          Detailed breakdown for {monthNames[data.month]} {data.year}
        </p>
      </motion.div>

      <Tabs defaultValue="salary">
        <TabsList className="flex w-full overflow-x-auto md:grid md:grid-cols-3">
          <TabsTrigger value="salary">Salary</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="advances">Advances & Leave</TabsTrigger>
        </TabsList>

        {/* Salary Tab */}
        <TabsContent value="salary">
          <motion.div variants={staggerContainer} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span>Base Salary</span>
                    <span className="font-medium">
                      {formatCurrency(data.monthlySalary)}
                    </span>
                  </div>
                  <div className="flex justify-between text-red-600">
                    <span>Attendance Deduction</span>
                    <span>-{formatCurrency(data.attendanceDeduction)}</span>
                  </div>
                  <div className="flex justify-between text-orange-600">
                    <span>Advance Deduction</span>
                    <span>-{formatCurrency(data.totalAdvance)}</span>
                  </div>
                  {data.eidBonus > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>
                        {data.eidBonusFestivalName || "Festival"} Bonus
                      </span>
                      <span>+{formatCurrency(data.eidBonus)}</span>
                    </div>
                  )}
                  <div className="border-t pt-3 mt-2">
                    <div className="flex justify-between font-bold">
                      <span>Net Salary</span>
                      <span className="text-blue-600">
                        {formatCurrency(data.netSalary)}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground mt-2">
                      <span>Daily Rate</span>
                      <span>{formatCurrency(data.dailyRate)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-4">
                {/* Salary Status Card */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Banknote className="h-4 w-4" />
                      Salary Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-3">
                      {data.salaryPaid ? (
                        <>
                          <CheckCircle2 className="h-8 w-8 text-green-600" />
                          <div>
                            <p className="font-medium text-green-600">Paid</p>
                            <p className="text-xs text-muted-foreground">
                              {data.salaryPaidAt
                                ? `Paid on ${format(new Date(data.salaryPaidAt), "MMM dd, yyyy")}`
                                : "Paid"}
                            </p>
                          </div>
                        </>
                      ) : (
                        <>
                          <Clock className="h-8 w-8 text-yellow-600" />
                          <div>
                            <p className="font-medium text-yellow-600">
                              Pending
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Awaiting payment
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Bonus Status Card */}
                {data.eidBonus > 0 && (
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Gift className="h-4 w-4" />
                        {data.eidBonusFestivalName || "Festival"} Bonus Status
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-3">
                        {data.eidBonusPaid ? (
                          <>
                            <CheckCircle2 className="h-8 w-8 text-green-600" />
                            <div>
                              <p className="font-medium text-green-600">Paid</p>
                              <p className="text-xs text-muted-foreground">
                                {data.eidBonusPaidAt
                                  ? `Paid on ${format(new Date(data.eidBonusPaidAt), "MMM dd, yyyy")}`
                                  : "Bonus paid"}
                              </p>
                            </div>
                          </>
                        ) : (
                          <>
                            <Clock className="h-8 w-8 text-yellow-600" />
                            <div>
                              <p className="font-medium text-yellow-600">
                                Pending
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Added to salary, awaiting disbursement
                              </p>
                            </div>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Leave Quota Card */}
                <Card>
                  <CardHeader>
                    <CardTitle>Leave Quota (Annual)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Used: {data.usedLeaves} days</span>
                        <span>Remaining: {data.leaveRemaining} days</span>
                      </div>
                      <Progress
                        value={(data.usedLeaves / data.leaveQuota) * 100}
                        className="h-2"
                      />
                      <p className="text-xs text-muted-foreground mt-2">
                        Total quota: {data.leaveQuota} days per year
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Salary History */}
            {data.salaryHistory.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Salary History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {data.salaryHistory.map((record, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center border-b pb-2"
                      >
                        <div>
                          <span className="font-medium">
                            {format(new Date(record.month), "MMMM yyyy")}
                          </span>
                          {record.eidBonus > 0 && (
                            <span className="text-xs text-green-600 ml-2">
                              (incl. bonus)
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-medium">
                            {formatCurrency(record.netPayable)}
                          </span>
                          {record.paid ? (
                            <Badge className="bg-green-100 text-green-700">
                              Paid
                            </Badge>
                          ) : (
                            <Badge
                              variant="outline"
                              className="bg-yellow-50 text-yellow-700"
                            >
                              Pending
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </TabsContent>

        {/* Attendance Tab */}
        <TabsContent value="attendance">
          <motion.div variants={staggerContainer} className="space-y-6">
            <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Present</CardTitle>
                  <CalendarCheck className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {data.presentDays}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Half Days</CardTitle>
                  <Clock className="h-4 w-4 text-yellow-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">
                    {data.halfDays}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Absent</CardTitle>
                  <CalendarX className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">
                    {data.absentDays}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Days/Month</CardTitle>
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{data.daysInMonth}</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Attendance Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">This month</span>
                  <span className="font-semibold">{attendanceRate.toFixed(1)}%</span>
                </div>
                <Progress value={attendanceRate} className="h-2" />
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Advances & Leave Tab */}
        <TabsContent value="advances">
          <motion.div variants={staggerContainer} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Advance Salary Requests</CardTitle>
              </CardHeader>
              <CardContent>
                {data.advanceList.length === 0 ? (
                  <p className="text-muted-foreground">
                    No advance requests found.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {data.advanceList.map((adv, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center border-b pb-2"
                      >
                        <div>
                          <p className="font-medium">
                            {formatCurrency(adv.amount)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {adv.reason || "No reason"}
                            <br />
                            {format(new Date(adv.requestedAt), "MMM dd, yyyy")}
                          </p>
                        </div>
                        <Badge
                          variant={
                            adv.status === "APPROVED" ? "default" : "outline"
                          }
                        >
                          {adv.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
