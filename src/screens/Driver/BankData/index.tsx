import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  ScrollView,
  SafeAreaView,
  Alert,} from 'react-native';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { TextInput } from '../../../components/TextInput';
import { Button } from '../../../components/Button';
import { Title } from '../../../components/Title';
import { SelectList } from '../../../components/SelectList';
import { RadioGroup } from '../../../components/RadioGroup';
import { bankRows } from '../../../utils/bankRows';
import { Container, Form } from './styles';
import { api } from '../../../config/api';
import { useAuth } from '../../../hooks/auth';
import { Checkbox } from '../../../components/Checkbox';

export const BankData: React.FC = () => {
  const { user, setLoading, updateUser } = useAuth();
  const { conta } = user;
  const tipoConta = !conta.tipoConta ? '' : conta.tipoConta === 'C' ? 'Conta Corrente' : 'Conta Poupança';
  const [meiosPagamentoActive, setMeiosPagamentoActive] = useState('PagSeguro');
  const [tipoContaActive, setTipoContaActive] = useState(tipoConta);
  const bankData = useMemo(() => {
    return bankRows.map((item: { label: string; value: string }) => ({
      nome: `${item.value} - ${item.label}`,
      id: item.value,
    }));
  }, []);
  const [instituicao, setInstituicao] = useState(tipoConta);

  const meiosPagamento = useMemo(() => {
    const options = ['PagSeguro', 'Pix', 'Conta Bancária'];

    return options.map(item => ({ label: item, isChecked: meiosPagamentoActive === item }));
  }, [meiosPagamentoActive]);

  const tiposContas = useMemo(() => {
    const options = ['Conta-Corrente', 'Conta Poupança'];

    return options.map(item => ({ label: item, isChecked: tipoContaActive === item }));
  }, [tipoContaActive]);

  const { values, handleChange, submitForm, setFieldValue, errors, isValid } = useFormik({
    initialValues: {
      emailPagSeguro: conta.emailPagSeguro || '',
      instituicao: conta.instituicao || '',
      agencia: conta.agencia || '',
      nuConta: conta.nuConta || '',
      digito: conta.digito || '',
      pix: conta.pix || '',
      checekbox: false,
    },
    validationSchema: Yup.object({
      emailPagSeguro: Yup.string().email('E-mail inválido'),
      checekbox: Yup.boolean().oneOf([true], 'Você precisa confirmar que os dados são seus e não de terceiros'),
    }),
    onSubmit: async values => {
      setLoading(true);

      const tipoConta = tipoContaActive === 'Conta-Corrente' ? 'C' : 'P';
      try {
        await api.put('api/user/v1/updateAccount', { ...values, tipoConta });
        updateUser({ ...user, conta: { ...user.conta, ...values, tipoConta } });
        Alert.alert('Feito!', 'Dados alterados com sucesso');
      } catch (e) {
   
        const errors = e.response.data.hasOwnProperty('errors') ? e.response.data.errors : e.response.data.message;
        const message = typeof errors === 'string' ? errors : errors.join('. ');
        Alert.alert('Algo deu errado', message);
      }
      setLoading(false);
    },
  });
  const handleSubmit = useCallback(() => {
    if (!isValid) {
      Alert.alert('Oops!', 'Verifique os seus dados e tente novamente');
    } else {
      submitForm();
    }
  }, []);

  return (
    <KeyboardAvoidingView behavior={Platform.OS == 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <TouchableWithoutFeedback style={{ flex: 1 }} onPress={Keyboard.dismiss}>
        <SafeAreaView style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
            <Container>
              <Title fontSize="20px">Meus Dados Bancários</Title>
              <Form>
                <RadioGroup items={meiosPagamento} setRadioActive={setMeiosPagamentoActive} />

                {meiosPagamentoActive === 'PagSeguro' && (
                  <TextInput
                    label="E-mail da conta PagSeguro"
                    errors={errors}
                    name="emailPagSeguro"
                    handleChange={handleChange}
                    values={values}
                    theme="flat"
                    keyboardType="email-address"
                  />
                )}
                {meiosPagamentoActive === 'Pix' && (
                  <TextInput
                    label="Chave PIX"
                    errors={errors}
                    name="pix"
                    handleChange={handleChange}
                    values={values}
                    theme="flat"
                  />
                )}
                {meiosPagamentoActive === 'Conta Bancária' && (
                  <SelectList
                    label="Instituição Bancária"
                    error={errors}
                    name="instituicao"
                    value={instituicao}
                    data={bankData}
                    handleChange={(selected: any) => {
                      setInstituicao(selected.value);
                      values.instituicao = selected.value;
                    }}
                  />
                )}
                {meiosPagamentoActive === 'Conta Bancária' && (
                  <RadioGroup items={tiposContas} setRadioActive={setTipoContaActive} />
                )}
                {meiosPagamentoActive === 'Conta Bancária' && (
                  <TextInput
                    label="Agência"
                    errors={errors}
                    name="agencia"
                    handleChange={handleChange}
                    values={values}
                    theme="flat"
                    keyboardType="numeric"
                  />
                )}
                {meiosPagamentoActive === 'Conta Bancária' && (
                  <TextInput
                    label="Conta (somente números)"
                    errors={errors}
                    name="nuConta"
                    handleChange={handleChange}
                    values={values}
                    theme="flat"
                    keyboardType="numeric"
                  />
                )}
                {meiosPagamentoActive === 'Conta Bancária' && (
                  <TextInput
                    label="Dígito"
                    errors={errors}
                    name="digito"
                    handleChange={handleChange}
                    values={values}
                    theme="flat"
                    keyboardType="numeric"
                    maxLength={1}
                  />
                )}
                <Checkbox
                  isChecked={values.checekbox}
                  onPress={() => setFieldValue('checekbox', !values.checekbox)}
                  errors={errors}
                  name="checekbox"
                >
                  Eu confirmo que os dados acima informados são meus e não de terceiros
                </Checkbox>
                <Button onPress={handleSubmit}>Salvar</Button>
              </Form>
            </Container>
          </ScrollView>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};
