import Inflector from 'ember-inflector';

const inflector = Inflector.inflector;

inflector.irregular('entity', 'Entitys');
inflector.irregular('access', 'Accesss');
inflector.irregular('personmetadata', 'PersonMetaDatas');
inflector.irregular('requestpersondata', 'RequestPersonDatas');
inflector.irregular('person', 'Persons');

export default {};
