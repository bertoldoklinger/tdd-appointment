🗓️ Schedule Appointment Service
Service utilizado para criar um agendamento.

Service: AppointmentService.scheduleAppointment()

Inputs:
patientId: Identificador único para o paciente.
startDate: A data e hora de início do agendamento (formato ISO 8601).
endDate: A data e hora de término do agendamento (formato ISO 8601).
Casos de Sucesso
✅ Um agendamento não confirmado é criado com sucesso.
✅ O agendamento deve ser salvo de forma persistente no banco de dados.
✅ O agendamento deve ocorrer dentro da disponibilidade do usuário.
✅ O sistema deve garantir que o agendamento não conflita com outros compromissos existentes.
Casos de Falha
⛔ End Date antes do Start Date: O horário de término é anterior ao horário de início.
⛔ Datas não no mesmo dia: O horário de início e término não estão no mesmo dia.
⛔ Paciente inválido: O patientId fornecido é inválido.
⛔ Paciente inexistente: O paciente não existe no sistema.
⛔ Conflito de Agendamentos: Já existe um agendamento no mesmo horário para o mesmo paciente.
✅ Success Case - Detalhamento
O agendamento deve ser criado como não confirmado inicialmente.
Após a criação bem-sucedida, o agendamento deve ser salvo de forma persistente (usando o Prisma).
O sistema deve garantir que o agendamento criado respeite a disponibilidade do usuário para o dia e o horário selecionado.
O agendamento criado deve retornar um objeto com os detalhes do compromisso (ex: appointmentId, startDate, endDate, confirmed, patientId).
⛔ Failure Cases - Detalhamento
⛔ End Date antes do Start Date
O sistema deve lançar uma exceção InvalidDateException se a data de término (endDate) for anterior à data de início (startDate).
⛔ Datas não no mesmo dia
O sistema deve lançar uma exceção InvalidDateException se as datas de início e término do agendamento não estiverem no mesmo dia.
⛔ Paciente inválido
Se o patientId fornecido não for válido, o sistema deve lançar uma exceção PatientNotFoundException.
⛔ Paciente inexistente
Caso o paciente associado ao agendamento não seja encontrado no sistema, o sistema deve lançar uma exceção PatientNotFoundException.
⛔ Conflito de Agendamentos
Se houver outro compromisso existente para o mesmo paciente dentro do mesmo intervalo de tempo, o sistema deve lançar uma exceção AppointmentConflictException.
🧪 Testes Unitários - Cenários
🟢 Cenários de Sucesso:
CT-001: Deve permitir a criação de um agendamento com dados válidos.
CT-002: Deve persistir o agendamento no banco de dados após a criação.
CT-003: Deve retornar um objeto AppointmentModel com os dados corretos do agendamento.
🔴 Cenários de Falha:
CT-004: Tentar criar um agendamento com endDate anterior a startDate deve lançar InvalidDateException.
CT-005: Tentar criar um agendamento com startDate e endDate em dias diferentes deve lançar InvalidDateException.
CT-006: Tentar criar um agendamento com um patientId inválido deve lançar PatientNotFoundException.
CT-007: Tentar criar um agendamento para um paciente inexistente deve lançar PatientNotFoundException.
CT-008: Tentar criar um agendamento que conflite com outro já existente deve lançar AppointmentConflictException.
🚀 Regras de Negócio
O agendamento deve ser criado com a flag confirmed como false inicialmente.
As datas de início e término devem estar dentro do mesmo dia.
O paciente deve existir no sistema e ser validado antes da criação do agendamento.
O sistema deve verificar conflitos de agendamentos no banco de dados.
🔧 Exceções Lançadas
InvalidDateException: Lançada quando as regras de validação de datas não são respeitadas.
PatientNotFoundException: Lançada quando o paciente associado ao agendamento não é encontrado.
AppointmentConflictException: Lançada quando o horário do agendamento conflita com um agendamento existente.
