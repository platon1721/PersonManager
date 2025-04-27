package com.example.personmanager.mapper;

import com.example.personmanager.dto.PersonDTO;
import com.example.personmanager.model.Person;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class PersonMapper {

    public PersonDTO toDTO(Person person) {
        if (person == null) {
            return null;
        }

        return new PersonDTO(
                person.getId(),
                person.getName(),
                person.getBirthDate(),
                person.getEmail(),
                person.getPhoneNumber()
        );
    }

    public Person toEntity(PersonDTO dto) {
        if (dto == null) {
            return null;
        }

        Person person = new Person();
        person.setId(dto.getId());
        person.setName(dto.getName());
        person.setBirthDate(dto.getBirthDate());
        person.setEmail(dto.getEmail());
        person.setPhoneNumber(dto.getPhoneNumber());

        return person;
    }

    public List<PersonDTO> toDTOList(List<Person> persons) {
        return persons.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
}