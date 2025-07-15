export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { default: initializeDatabase } = await import("./lib/db/init");
    await initializeDatabase();

    (async () => {
      const { default: registerAdmin } = await import("./features/common/utilities/Admin");
      console.log("📢 Instrumentation running...");
      await registerAdmin();
      console.log("✅ Admin registered");
    })();

    const cronModule = await import("node-cron");
    const generateFees = (await import("./features/common/utilities/feeGenerate")).generateMonthlyStudentFees;

    cronModule.default.schedule("0 0 1 * *", async () => {
    // cronModule.default.schedule("* * * * *", async () => {
      // Runs on the 1st day of every month at 00:00
      console.log("🕐 [Cron] Generating monthly student fee records...");
      try {
        await generateFees();
        console.log("✅ Fee records generated successfully.");
      } catch (error) {
        console.error("❌ Error during fee generation:", error);
      }
    });
  }
}
