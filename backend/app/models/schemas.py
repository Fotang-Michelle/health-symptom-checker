from marshmallow import Schema, fields, validate

class SymptomRequestSchema(Schema):
    symptoms = fields.List(
        fields.Str(),
        required=True,
        validate=validate.Length(min=1, error="At least one symptom is required.")
    )

class LoginSchema(Schema):
    email    = fields.Email(required=True)
    password = fields.Str(required=True, validate=validate.Length(min=6))

class RegisterSchema(Schema):
    email    = fields.Email(required=True)
    password = fields.Str(required=True, validate=validate.Length(min=8))
    name     = fields.Str(required=True, validate=validate.Length(min=1))