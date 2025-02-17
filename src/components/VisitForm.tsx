import { useState } from "react";
import {
  TextInput,
  Button,
  Paper,
  Title,
  Grid,
  Stack,
  Text,
  LoadingOverlay,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { db } from "../config/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { notifications } from "@mantine/notifications";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserPlus,
  faBuilding,
  faIdCard,
  faEnvelope,
  faPhone,
  faClock,
} from "@fortawesome/free-solid-svg-icons";
import SuccessModal from "./SuccessModal";

const VisitForm = () => {
  const [showVisitorForm, setShowVisitorForm] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    initialValues: {
      employeeNumber: "",
      name: "",
      department: "",
      employeeEmail: "",
      employeePhone: "",
      visitorName: "",
      profession: "",
      visitorPhone: "",
      date: new Date().toISOString().split("T")[0],
      time: new Date()
        .toLocaleTimeString("en-US", { hour12: false })
        .slice(0, 5),
      idNumber: "",
    },
    validate: {
      employeeNumber: (value) => (value ? null : "Employee number is required"),
      name: (value) => (value ? null : "Name is required"),
      department: (value) => (value ? null : "Department is required"),
      employeeEmail: (value) =>
        /^\S+@\S+$/.test(value) ? null : "Invalid email",
      employeePhone: (value) =>
        /^\+?[\d\s-]{10,}$/.test(value) ? null : "Invalid phone number",
      visitorName: (value) =>
        showVisitorForm && !value ? "Visitor name is required" : null,
      profession: (value) =>
        showVisitorForm && !value ? "Profession is required" : null,
      visitorPhone: (value) =>
        showVisitorForm && !value ? "Visitor phone is required" : null,
      date: (value) => (showVisitorForm && !value ? "Date is required" : null),
      time: (value) => (showVisitorForm && !value ? "Time is required" : null),
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    if (!showVisitorForm) {
      setShowVisitorForm(true);
      return;
    }

    try {
      setIsSubmitting(true);

      // First save the visit data
      const visitData = {
        employeeNumber: values.employeeNumber,
        name: values.name,
        department: values.department,
        employeeEmail: values.employeeEmail,
        employeePhone: values.employeePhone,
        visitorName: values.visitorName,
        profession: values.profession,
        visitorPhone: values.visitorPhone,
        date: values.date,
        time: values.time,
        idNumber: values.idNumber,
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, "visits"), visitData);


      setShowSuccessModal(true);
      form.reset();
      setShowVisitorForm(false);
    } catch (error) {
      console.error("Error submitting form:", error);
      notifications.show({
        title: "Error",
        message: "Failed to record visit. Please try again.",
        color: "red",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <Paper radius="md" p="xl" withBorder mb="xl" shadow="sm" pos="relative">
          <LoadingOverlay visible={isSubmitting} overlayProps={{ blur: 2 }} />
          <Stack gap="lg">
            <Title order={2} ta="center" c="blue">
              Employee Information
            </Title>
            <Text c="dimmed" size="sm" ta="center" maw={600} mx="auto">
              Please fill in the employee details below. Once completed, you can
              add visitor information.
            </Text>

            <form onSubmit={form.onSubmit(handleSubmit)}>
              <Grid>
                <Grid.Col span={{ base: 12, sm: 4 }}>
                  <TextInput
                    label="Employee Number"
                    required
                    leftSection={<FontAwesomeIcon icon={faIdCard} size="1x" />}
                    {...form.getInputProps("employeeNumber")}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 4 }}>
                  <TextInput
                    label="Employee Name"
                    required
                    leftSection={
                      <FontAwesomeIcon icon={faUserPlus} size="1x" />
                    }
                    {...form.getInputProps("name")}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 4 }}>
                  <TextInput
                    label="Department"
                    required
                    leftSection={
                      <FontAwesomeIcon icon={faBuilding} size="1x" />
                    }
                    {...form.getInputProps("department")}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 6 }}>
                  <TextInput
                    label="Employee Email"
                    required
                    leftSection={
                      <FontAwesomeIcon icon={faEnvelope} size="1x" />
                    }
                    {...form.getInputProps("employeeEmail")}
                  />
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 6 }}>
                  <TextInput
                    label="Phone Number"
                    required
                    leftSection={<FontAwesomeIcon icon={faPhone} size="1x" />}
                    {...form.getInputProps("employeePhone")}
                  />
                </Grid.Col>
              </Grid>

              {!showVisitorForm && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Button
                    mt="xl"
                    onClick={() => form.onSubmit(handleSubmit)()}
                    fullWidth
                    variant="light"
                    leftSection={
                      <FontAwesomeIcon icon={faUserPlus} size="1x" />
                    }
                  >
                    Add Visitor Information
                  </Button>
                </motion.div>
              )}

              <AnimatePresence>
                {showVisitorForm && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  >
                    <Paper withBorder p="md" radius="md" mt="xl" shadow="sm">
                      <Title order={3} mb="lg" c="blue">
                        Visitor Information
                      </Title>
                      <Grid>
                        <Grid.Col span={{ base: 12, sm: 6 }}>
                          <TextInput
                            label="Visitor Name"
                            required
                            leftSection={
                              <FontAwesomeIcon icon={faUserPlus} size="1x" />
                            }
                            {...form.getInputProps("visitorName")}
                          />
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, sm: 6 }}>
                          <TextInput
                            label="Profession"
                            required
                            leftSection={
                              <FontAwesomeIcon icon={faBuilding} size="1x" />
                            }
                            {...form.getInputProps("profession")}
                          />
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, sm: 6 }}>
                          <TextInput
                            label="Phone Number"
                            required
                            leftSection={
                              <FontAwesomeIcon icon={faPhone} size="1x" />
                            }
                            {...form.getInputProps("visitorPhone")}
                          />
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, sm: 6 }}>
                          <TextInput
                            label="ID Number"
                            leftSection={
                              <FontAwesomeIcon icon={faIdCard} size="1x" />
                            }
                            {...form.getInputProps("idNumber")}
                          />
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, sm: 6 }}>
                          <TextInput
                            label="Date"
                            type="date"
                            required
                            {...form.getInputProps("date")}
                          />
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, sm: 6 }}>
                          <TextInput
                            label="Time"
                            type="time"
                            required
                            leftSection={
                              <FontAwesomeIcon icon={faClock} size="1x" />
                            }
                            {...form.getInputProps("time")}
                          />
                        </Grid.Col>
                      </Grid>
                      <Button
                        type="submit"
                        mt="xl"
                        fullWidth
                        size="md"
                        loading={isSubmitting}
                      >
                        Confirm Visit
                      </Button>
                    </Paper>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </Stack>
        </Paper>
      </motion.div>

      <SuccessModal
        opened={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Visit Recorded Successfully!"
        message="The visitor information has been recorded and an email notification has been sent."
      />
    </>
  );
};

export default VisitForm;
