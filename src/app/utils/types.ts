export type ExcursaoFormProps = {
  excursao?: Excursao
};
export type Excursao = {
  id: string;
  nome: string;
  descricao: string;
  estado: string;
  origem: string;
  rota: string[];
  phone_numbers: string[];
}